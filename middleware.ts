import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/mycourses',
  '/schedule',
  '/analytics',
  '/community',
  '/messages',
  '/notifications',
  '/settings',
  '/profile',
  '/cart',
  '/checkout',
  '/payment',
  '/wishlist',
]

// Routes that are always public
const PUBLIC_ROUTES = [
  '/',
  '/landing',
  '/login',
  '/signup',
  '/superlogin-bypass',
  '/forgot-password',
  '/reset-password',
  '/auth-test',
  '/courses', // Course browsing is public
]

// Routes that should redirect to dashboard if already authenticated
const AUTH_ROUTES = [
  '/login',
  '/signup',
  '/superlogin-bypass',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value
  const isAuthenticated = !!token

  // Special handling for course learning pages - these require authentication
  // Pattern: /courses/[id]/learn
  if (pathname.match(/^\/courses\/[^/]+\/learn/)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Course detail pages are public - Pattern: /courses/[id] (but not /courses/[id]/*)
  // This allows anyone to view course details before enrolling
  if (pathname.match(/^\/courses\/[^/]+$/)) {
    return NextResponse.next()
  }

  // Check if the current path is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))

  // Check if the current path is an auth route (login/signup)
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(route))

  // Check if the current path is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/mycourses', request.url))
  }

  // If user is not authenticated and trying to access protected routes, redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is not authenticated and trying to access non-public, non-protected routes, redirect to login
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
