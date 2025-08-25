'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle, FileText, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetch('/api/admin/check')
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.isAdmin)
          setLoading(false)
          if (!data.isAdmin) {
            router.push('/')
          }
        })
        .catch(() => {
          setLoading(false)
          router.push('/')
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-virtue">
          Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground">
          Manage your homelab blog
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5 text-green-500" />
              <CardTitle className="font-virtue">New Post</CardTitle>
            </div>
            <CardDescription>
              Create a new blog post with markdown editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/posts/new">
              <Button className="w-full">
                Create Post
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <CardTitle className="font-virtue">Manage Posts</CardTitle>
            </div>
            <CardDescription>
              Edit and manage existing blog posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/posts">
              <Button variant="outline" className="w-full">
                View Posts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-purple-500" />
              <CardTitle className="font-virtue">Site Settings</CardTitle>
            </div>
            <CardDescription>
              Configure blog settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}