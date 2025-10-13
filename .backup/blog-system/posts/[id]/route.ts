import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET - Get single post for editing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId || userId !== process.env.ADMIN_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId || userId !== process.env.ADMIN_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, slug, content, excerpt, category, tags, published } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Check if slug already exists for other posts
    const existingPost = await pool.query(
      'SELECT id FROM posts WHERE slug = $1 AND id != $2', 
      [slug, id]
    )
    if (existingPost.rows.length > 0) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE posts 
       SET title = $1, slug = $2, content = $3, excerpt = $4, category = $5, tags = $6, published = $7
       WHERE id = $8
       RETURNING *`,
      [title, slug, content, excerpt, category, tags || [], published || false, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId || userId !== process.env.ADMIN_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id])
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}