'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Edit, Eye, EyeOff } from 'lucide-react'
import type { BlogPost } from '@/lib/posts'

export default function PostsListPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.isAdmin)
          if (!data.isAdmin) {
            router.push('/')
            return
          }
          
          // Fetch all content (MDX + Database)
          return fetch('/api/admin/all-content')
        })
        .then(res => res?.json())
        .then(postsData => {
          if (postsData) {
            setPosts(postsData)
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
          router.push('/admin')
        })
    } else if (isLoaded && !user) {
      setLoading(false)
      router.push('/')
    }
  }, [user, isLoaded, router])

  if (loading || !isLoaded) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4 font-virtue">
            Manage Posts
          </h1>
          <p className="text-xl text-muted-foreground">
            Edit and organize your content
          </p>
        </div>
        
        <Link href="/admin/posts/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No posts yet</CardTitle>
            <CardDescription>
              Create your first blog post to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/posts/new">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Card key={post.id || `mdx-${index}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="font-virtue">{post.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        {post.source === 'mdx' ? (
                          <Badge className="bg-blue-500 hover:bg-blue-600">
                            MDX
                          </Badge>
                        ) : (
                          <>
                            <Badge className="bg-purple-500 hover:bg-purple-600">
                              DB
                            </Badge>
                            {post.published ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                <Eye className="h-3 w-3 mr-1" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <EyeOff className="h-3 w-3 mr-1" />
                                Draft
                              </Badge>
                            )}
                          </>
                        )}
                        {post.category && (
                          <Badge variant="outline">{post.category}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardDescription className="mb-2">
                      {post.excerpt || 'No excerpt provided'}
                    </CardDescription>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground mt-2">
                      Date: {new Date(post.date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    {post.source === 'database' ? (
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" size="sm" disabled title="MDX files are edited via Claude commands">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}