import CourseDetailPage from "@/components/CourseDetailPage"

// Server component approach - fetch data on server
async function getCourseData(courseId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
    const response = await fetch(`${baseUrl}/api/courses/${courseId}`, {
      cache: 'no-store', // Always fresh data
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const courseId = resolvedParams.id
  
  // Just pass courseId - the component will fetch data client-side
  return <CourseDetailPage courseId={courseId} />
}
