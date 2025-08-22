import { getAllPosts, getAllCategories } from '@/lib/posts'
import { BlogCard } from '@/components/blog/BlogCard'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Blog Posts",
  description: "Infrastructure as Code when you barely know how to code. Real failures, real solutions from a homelab journey.",
  openGraph: {
    title: "Blog Posts | Breaking Shit & Fixing It",
    description: "Infrastructure as Code when you barely know how to code. Real failures, real solutions from a homelab journey.",
    url: "https://homelab-blog.vercel.app/blog",
    images: [
      {
        url: "/og-image-blog.png",
        width: 1200,
        height: 630,
        alt: "Blog Posts - Breaking Shit & Fixing It"
      }
    ]
  },
  twitter: {
    title: "Blog Posts | Breaking Shit & Fixing It",
    description: "Infrastructure as Code when you barely know how to code. Real failures, real solutions from a homelab journey.",
    images: ["/og-image-blog.png"]
  }
}

export default function BlogPage() {
  const posts = getAllPosts()
  const categories = getAllCategories()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-virtue">
          All Posts
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Homelab chaos documented.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-sm text-muted-foreground mr-2">Categories:</span>
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="font-mono">
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No posts yet</CardTitle>
            <CardDescription>
              Blog posts will appear here once they are created.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}