import { Suspense } from 'react'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { BlogCard } from '@/components/blog/BlogCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Async component for recent posts
async function RecentPosts() {
  const recentPosts = (await getAllPosts()).slice(0, 3)

  if (recentPosts.length === 0) return null

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-6 font-virtue">Recent Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recentPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="text-center mt-8">
        <Link href="/blog">
          <Button variant="outline">View All Posts</Button>
        </Link>
      </div>
    </div>
  )
}

// Loading component for recent posts
function RecentPostsLoading() {
  return (
    <div>
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="text-center mt-8">
        <div className="h-10 w-32 bg-muted animate-pulse rounded mx-auto" />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-virtue">What This Is</CardTitle>
              <CardDescription>
                My first homelab setup, documented as I learn
              </CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="mb-4 text-muted-foreground">
                This is my first homelab running on a Minisforum UN100. I&apos;m learning infrastructure by building it, breaking it, and documenting what might actually work. Packer for VM images, Vagrant for management, tmux for automation, and Claude Code as my agentic OS.
              </p>
              <p className="mb-6 text-muted-foreground">
                Each post covers real problems I&apos;ve hit and the actual solutions that worked. No theory, no best practices from people who&apos;ve never touched production - just what happens when you learn DevOps by doing it.
              </p>
              <p className="text-sm text-muted-foreground">
                Cheers, <a href="https://willyv3.com/app-playground" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground underline font-virtue">WillyV3</a>
              </p>
            </CardContent>
          </Card>
        </div>

        <Suspense fallback={<RecentPostsLoading />}>
          <RecentPosts />
        </Suspense>
      </div>
    </div>
  )
}
