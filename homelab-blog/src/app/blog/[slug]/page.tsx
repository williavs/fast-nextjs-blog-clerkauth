import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { BlogLayout } from '@/components/blog/BlogLayout'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/blog/MDXComponents'
import { CommentSection } from '@/components/comments/CommentSection'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  
  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.excerpt,
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