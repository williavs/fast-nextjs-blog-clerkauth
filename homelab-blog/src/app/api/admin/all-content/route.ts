import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getMdxPosts, getDatabasePosts } from '@/lib/posts'

// GET - List all content (MDX + Database) for admin
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId || userId !== process.env.ADMIN_ID) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get both MDX and database posts (including drafts)
    const mdxPosts = getMdxPosts()
    const dbPosts = await getDatabasePosts(false) // Get all DB posts including drafts
    
    // Combine and sort by date
    const allContent = [...mdxPosts, ...dbPosts].sort((a, b) => (a.date < b.date ? 1 : -1))

    return NextResponse.json(allContent)
  } catch (error) {
    console.error('Get all content error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}