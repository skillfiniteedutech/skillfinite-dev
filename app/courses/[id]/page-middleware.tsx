import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware approach - handle routing logic before page
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if this is a course detail page
  if (pathname.startsWith('/courses/') && pathname.split('/').length === 3) {
    const courseId = pathname.split('/')[2]
    
    // Validate course ID format
    if (!courseId || courseId.length < 3) {
      return NextResponse.redirect(new URL('/courses', request.url))
    }
    
    // Add course ID to headers for the page component
    const response = NextResponse.next()
    response.headers.set('x-course-id', courseId)
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/courses/:id*',
}
