'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Comment } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send } from 'lucide-react'

interface CommentFormProps {
  postSlug: string
  parentId?: number
  onCommentAdded: (comment: Comment) => void
  placeholder?: string
  compact?: boolean
}

export function CommentForm({ 
  postSlug, 
  parentId, 
  onCommentAdded, 
  placeholder = "Share your thoughts...",
  compact = false 
}: CommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_slug: postSlug,
          content: content.trim(),
          parent_id: parentId
        })
      })

      if (response.ok) {
        const newComment = await response.json()
        onCommentAdded(newComment)
        setContent('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const username = user?.firstName || user?.username || 'Anonymous'

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-start space-x-3">
        {!compact && (
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className={`resize-none ${compact ? 'min-h-[80px]' : 'min-h-[100px]'}`}
            disabled={isSubmitting}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!content.trim() || isSubmitting}
              size={compact ? "sm" : "default"}
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Posting...' : (parentId ? 'Reply' : 'Comment')}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}