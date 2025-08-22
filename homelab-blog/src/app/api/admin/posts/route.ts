import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

// GET - List all posts for admin
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId || userId !== process.env.ADMIN_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC'
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId || userId !== process.env.ADMIN_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, content, excerpt, category, tags, published } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Check if slug already exists
    const existingPost = await pool.query('SELECT id FROM posts WHERE slug = $1', [slug])
    if (existingPost.rows.length > 0) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO posts (title, slug, content, excerpt, category, tags, published) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [title, slug, content, excerpt, category, tags || [], published || false]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}