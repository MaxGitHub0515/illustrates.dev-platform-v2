import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublic = createRouteMatcher([
  '/', '/about(.*)', '/projects(.*)', '/blog(.*)', '/discussions(.*)',
  '/support(.*)', '/login(.*)', '/signup(.*)', '/terms(.*)', '/privacy(.*)',
  '/api/webhook(.*)',
])

const isAdmin = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return NextResponse.next()

  const { userId, sessionClaims } = await auth()

  if (!userId) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect_url', req.url)
    return NextResponse.redirect(url)
  }

  if (isAdmin(req)) {
    /*
     * Clerk does NOT include publicMetadata in the JWT by default.
     * The admin layout uses currentUser() for a reliable server-side check.
     * This middleware check is a fast-path that works IF you have configured
     * the Clerk JWT template (see SETUP.md).
     *
     * Without the JWT template configured, this always lets through —
     * the admin layout does the authoritative check via currentUser().
     *
     * To enable middleware-level check: Clerk Dashboard →
     * Configure → Sessions → Customize session token →
     * add: { "metadata": "{{user.public_metadata}}" }
     * then read as: sessionClaims?.metadata?.role
     */
    const claims = sessionClaims as Record<string, unknown> | null
    const metaRole =
      (claims?.metadata as { role?: string })?.role ??          // JWT template key
      (claims?.publicMetadata as { role?: string })?.role ??    // legacy key
      undefined

    // Only block if we have claims AND they say not admin
    // If claims are missing (no JWT template), let through to layout check
    if (metaRole !== undefined && metaRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
