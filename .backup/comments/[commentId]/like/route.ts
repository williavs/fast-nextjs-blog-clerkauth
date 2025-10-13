import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { pool } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { commentId } = await params
    
    // Check if user already liked this comment
    const existingLike = await pool.query(
      'SELECT id FROM comment_likes WHERE comment_id = $1 AND clerk_user_id = $2',
      [commentId, userId]
    )
    
    if (existingLike.rows.length > 0) {
      // Unlike: remove the like
      await pool.query(
        'DELETE FROM comment_likes WHERE comment_id = $1 AND clerk_user_id = $2',
        [commentId, userId]
      )
      return NextResponse.json({ liked: false })
    } else {
      // Like: add the like
      await pool.query(
        'INSERT INTO comment_likes (comment_id, clerk_user_id) VALUES ($1, $2)',
        [commentId, userId]
      )
      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}