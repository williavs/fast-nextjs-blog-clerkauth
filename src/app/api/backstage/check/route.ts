import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ isAdmin: false })
    }

    // Any authenticated user can access backstage
    return NextResponse.json({ isAdmin: true })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ isAdmin: false })
  }
}