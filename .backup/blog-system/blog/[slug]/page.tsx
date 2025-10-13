import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { BlogLayout } from '@/components/blog/BlogLayout'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/blog/MDXComponents'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return {}
  }

  const ogImage = `/og-image-post.png?title=${encodeURIComponent(post.title)}`

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [...(post.tags || []), "homelab", "devops", "infrastructure"],
    authors: [{ name: "WillyV3", url: "https://willyv3.com" }],
    openGraph: {
      type: "article",
      locale: "en_US",
      url: `https://breakshit.blog/blog/${slug}`,
      title: post.title,
      description: post.excerpt,
      siteName: "Breaking Shit & Fixing It",
      publishedTime: post.date,
      authors: ["WillyV3"],
      tags: post.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
      creator: "@willyv3"
    }
  }
}

// Async component for blog post content
async function PostContent({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogLayout post={post}>
      {post.source === 'mdx' ? (
        <MDXRemote 
          source={post.content} 
          components={mdxComponents}
        />
      ) : (
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <MDXRemote 
            source={post.content} 
            components={mdxComponents}
          />
        </div>
      )}
    </BlogLayout>
  )
}

// Loading component for blog post
function PostLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 pb-8 border-b">
        <div className="h-10 w-3/4 bg-muted animate-pulse rounded mb-4" />
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
      </div>
      <div className="prose prose-lg max-w-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="mb-6">
            <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-full bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PostLoading />}>
        <PostContent slug={slug} />
      </Suspense>
    </div>
  )
}