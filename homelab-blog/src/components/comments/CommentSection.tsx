'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { CommentsList } from './CommentsList'
import { CommentForm } from './CommentForm'
import { SignInPrompt } from './SignInPrompt'
import { Comment } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CommentSectionProps {
  postSlug: string
}

export function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const { isSignedIn } = useUser()

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`/api/comments?post_slug=${postSlug}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }, [postSlug])

  useEffect(() => {
    fetchComments()
  }, [postSlug, fetchComments])

  const handleCommentAdded = (newComment: Comment) => {
    if (newComment.parent_id) {
      // It's a reply - find the parent anywhere in the tree and add to its replies
      const addReplyToTree = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment.id === newComment.parent_id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), { ...newComment, replies: [] }]
            }
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: addReplyToTree(comment.replies)
            }
          }
          return comment
        })
      }
      setComments(prev => addReplyToTree(prev))
    } else {
      // It's a top-level comment
      setComments(prev => [...prev, { ...newComment, replies: [] }])
    }
  }

  const handleLikeUpdate = (commentId: number, liked: boolean) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          user_has_liked: liked,
          like_count: liked ? 
            (Number(comment.like_count) || 0) + 1 : 
            Math.max((Number(comment.like_count) || 0) - 1, 0)
        }
      }
      // Check replies too
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId ? {
              ...reply,
              user_has_liked: liked,
              like_count: liked ? 
                (Number(reply.like_count) || 0) + 1 : 
                Math.max((Number(reply.like_count) || 0) - 1, 0)
            } : reply
          )
        }
      }
      return comment
    }))
  }


  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading comments...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-mono">Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isSignedIn ? (
          <CommentForm 
            postSlug={postSlug} 
            onCommentAdded={handleCommentAdded}
          />
        ) : (
          <SignInPrompt />
        )}
        
        <Separator />
        
        <CommentsList 
          comments={comments}
          postSlug={postSlug}
          onCommentAdded={handleCommentAdded}
          onLikeUpdate={handleLikeUpdate}
        />
      </CardContent>
    </Card>
  )
}