'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/8bit/button'
import { Input } from '@/components/ui/8bit/input'
import { Label } from '@/components/ui/8bit/label'
import { Textarea } from '@/components/ui/8bit/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/8bit/card'
import { Badge } from '@/components/ui/8bit/badge'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Post } from '@/lib/db'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function EditPostPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [post, setPost] = useState<Post | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetch('/api/backstage/check')
        .then(res => res.json())
        .then(data => {
          setIsAdmin(data.isAdmin)
          if (!data.isAdmin) {
            router.push('/')
            return
          }
          
          // Fetch the post data
          return fetch(`/api/backstage/posts/${postId}`)
        })
        .then(res => res?.json())
        .then(postData => {
          if (postData) {
            setPost(postData)
            setTitle(postData.title)
            setContent(postData.content)
            setExcerpt(postData.excerpt || '')
            setCategory(postData.category || '')
            setTags(postData.tags || [])
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
          router.push('/backstage')
        })
    } else if (isLoaded && !user) {
      setLoading(false)
      router.push('/')
    }
  }, [user, isLoaded, router, postId])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSave = async (shouldPublish: boolean) => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required')
      return
    }

    setSaving(true)
    
    try {
      const slug = generateSlug(title)
      
      const response = await fetch(`/api/backstage/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          slug,
          content: content.trim(),
          excerpt: excerpt.trim() || undefined,
          category: category.trim() || undefined,
          tags,
          published: shouldPublish,
        }),
      })

      if (response.ok) {
        router.push('/backstage')
      } else {
        const error = await response.text()
        alert('Failed to update post: ' + error)
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch(`/api/backstage/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/backstage')
      } else {
        const error = await response.text()
        alert('Failed to delete post: ' + error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete post')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !isLoaded) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (!user || !isAdmin || !post) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-4 font-virtue">
          Edit Post
        </h1>
        <p className="text-xl text-muted-foreground">
          Update your homelab chaos
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-virtue">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt (optional)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description for SEO and cards"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category (optional)</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. infrastructure"
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-virtue">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={500}
              preview="edit"
              data-color-mode="light"
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-between">
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={saving}
          >
            {saving ? 'Deleting...' : 'Delete Post'}
          </Button>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/backstage')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button 
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}