'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { CommentForm } from './CommentForm'
import { Comment } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, MessageCircle } from 'lucide-react'


interface CommentsListProps {
  comments: Comment[]
  postSlug: string
  onCommentAdded: (comment: Comment) => void
  onLikeUpdate: (commentId: number, liked: boolean) => void
}

export function CommentsList({ comments, postSlug, onCommentAdded, onLikeUpdate }: CommentsListProps) {
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const { isSignedIn } = useUser()

  const handleLike = async (commentId: number) => {
    if (!isSignedIn) return
    
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const result = await response.json()
        // Optimistically update the specific comment
        onLikeUpdate(commentId, result.liked)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? 'ml-4 sm:ml-8 pl-4 border-l-2 border-muted' : ''}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {comment.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">{comment.username}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at))} ago
            </span>
          </div>
          
          <p className="text-sm leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:bg-accent"
              onClick={() => handleLike(comment.id)}
              disabled={!isSignedIn}
            >
              <Heart 
                className={`h-4 w-4 mr-1 ${
                  comment.user_has_liked ? 'fill-red-500 text-red-500' : ''
                }`} 
              />
              <span className="text-xs">{Number(comment.like_count) || 0}</span>
            </Button>
            
            {!isReply && isSignedIn && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 hover:bg-accent"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
          </div>
          
          {replyingTo === comment.id && (
            <div className="mt-3">
              <CommentForm
                postSlug={postSlug}
                parentId={comment.id}
                onCommentAdded={(newComment) => {
                  onCommentAdded(newComment)
                  setReplyingTo(null)
                }}
                placeholder={`Reply to ${comment.username}...`}
                compact
              />
            </div>
          )}
        </div>
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  )

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}