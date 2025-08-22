import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { pool } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postSlug = searchParams.get('post_slug')
    
    if (!postSlug) {
      return NextResponse.json({ error: 'Post slug is required' }, { status: 400 })
    }

    const { userId } = await auth()
    
    // Get comments with like counts and user's like status
    const query = `
      SELECT 
        c.*,
        COALESCE(like_data.like_count, 0) as like_count,
        COALESCE(like_data.user_has_liked, false) as user_has_liked
      FROM comments c
      LEFT JOIN (
        SELECT 
          comment_id,
          COUNT(*) as like_count,
          ${userId ? `BOOL_OR(clerk_user_id = $2) as user_has_liked` : 'false as user_has_liked'}
        FROM comment_likes
        GROUP BY comment_id
      ) like_data ON c.id = like_data.comment_id
      WHERE c.post_slug = $1
      ORDER BY c.created_at ASC
    `
    
    const values = userId ? [postSlug, userId] : [postSlug]
    const result = await pool.query(query, values)
    
    // Organize comments in a tree structure with unlimited depth
    const comments = result.rows
    const commentMap = new Map(comments.map(c => [c.id, { ...c, replies: [] }]))
    const commentTree: typeof comments = []
    
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentWithReplies)
        }
      } else {
        commentTree.push(commentWithReplies)
      }
    })
    
    return NextResponse.json(commentTree)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const { post_slug, content, parent_id } = await request.json()
    
    if (!post_slug || !content) {
      return NextResponse.json({ error: 'Post slug and content are required' }, { status: 400 })
    }

    const username = user.firstName || user.username || 'Anonymous'
    
    const query = `
      INSERT INTO comments (post_slug, clerk_user_id, username, content, parent_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    
    const values = [post_slug, userId, username, content, parent_id || null]
    const result = await pool.query(query, values)
    
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}