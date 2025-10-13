/**
 * Clerk middleware for BuiltByWilly portfolio.
 *
 * Security approach:
 * - All routes are public by default (portfolio showcase)
 * - Only /backstage routes require authentication
 * - Admin-only access enforced via ADMIN_ID environment variable
 * - Security through obscurity: /backstage is a non-obvious route name
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Protected routes that require authentication
// Only backstage (admin) routes are protected
const isProtectedRoute = createRouteMatcher([
  '/backstage(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  // Protect only backstage routes
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  // All other routes (portfolio, projects, blog) are public
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}