import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { BlogLayout } from '@/components/blog/BlogLayout'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/blog/MDXComponents'
import { CommentSection } from '@/components/comments/CommentSection'
import type { Metadata } from 'next'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
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
      url: `https://homelab-blog.vercel.app/blog/${slug}`,
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogLayout post={post}>
        <MDXRemote 
          source={post.content} 
          components={mdxComponents}
        />
      </BlogLayout>
      
      <div className="mt-12">
        <CommentSection postSlug={slug} />
      </div>
    </div>
  )
}