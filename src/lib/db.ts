import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export { pool }

export interface Comment {
  id: number
  post_slug: string
  clerk_user_id: string
  username: string
  content: string
  parent_id: number | null
  created_at: string
  updated_at: string
  like_count?: number
  user_has_liked?: boolean
  replies?: Comment[]
}

export interface CommentLike {
  id: number
  comment_id: number
  clerk_user_id: string
  created_at: string
}

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  published: boolean
  created_at: string
  updated_at: string
}