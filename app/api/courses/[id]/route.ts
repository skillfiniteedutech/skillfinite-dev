import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const courseId = resolvedParams.id

    // Try to get token from request headers for authenticated requests
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    // Make request to backend with optional authentication
    const response = await fetch(`${BACKEND_URL}/api/courses/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    })

    // If backend requires auth and we don't have it, try without auth first
    if (!response.ok && response.status === 401 && !token) {
      const publicResponse = await fetch(`${BACKEND_URL}/api/public/courses/${courseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (publicResponse.ok) {
        const data = await publicResponse.json()
        return NextResponse.json(data)
      }
    }

    if (!response.ok) {
      // Return a mock course data if backend fails
      const mockCourse = {
        success: true,
        data: {
          id: courseId,
          title: "Course Loading...",
          subtitle: "Please wait while we load the course details",
          description: "Course details are being loaded. This might take a moment.",
          category: "General",
          level: "Beginner",
          settings: {
            pricing: {
              type: "paid",
              price: 0
            },
            access: {
              enrollmentType: "open"
            }
          },
          rating: 4.5,
          studentsEnrolled: 0,
          duration: "10 hours",
          thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
          instructorId: "Expert Instructor",
          language: "English",
          captions: ["English [Auto]"],
          curriculum: [],
          learningObjectives: [],
          tags: [],
          requirements: [
            "No prior experience needed - we will teach you everything from scratch",
            "A computer with internet access",
            "A passion for learning!"
          ]
        }
      }
      return NextResponse.json(mockCourse)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Course API error:', error)
    
    // Return fallback data on error
    const fallbackCourse = {
      success: true,
      data: {
        id: (await params).id,
        title: "Course Unavailable",
        subtitle: "This course is currently unavailable",
        description: "We're having trouble loading this course. Please try again later.",
        category: "General",
        level: "Beginner",
        settings: {
          pricing: {
            type: "free",
            price: 0
          },
          access: {
            enrollmentType: "open"
          }
        },
        rating: 0,
        studentsEnrolled: 0,
        duration: "0 hours",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
        instructorId: "Instructor",
        language: "English",
        captions: ["English [Auto]"],
        curriculum: [],
        learningObjectives: [],
        tags: [],
        requirements: []
      }
    }
    
    return NextResponse.json(fallbackCourse)
  }
}
