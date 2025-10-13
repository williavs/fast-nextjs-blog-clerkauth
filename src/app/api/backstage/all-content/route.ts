import { NextResponse } from 'next/server'

// This endpoint has been removed - blog functionality no longer exists
export async function GET() {
  return NextResponse.json({ error: 'This endpoint has been removed' }, { status: 404 })
}
