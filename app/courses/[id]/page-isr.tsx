import CourseDetailPage from "@/components/CourseDetailPage"

// ISR (Incremental Static Regeneration) approach
export async function generateStaticParams() {
  // Fetch some popular courses to pre-build
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://skillfinite-backend-47sd.onrender.com'
    const response = await fetch(`${baseUrl}/api/courses`, {
      cache: 'no-store',
    })
    
    if (response.ok) {
      const data = await response.json()
      const courses = data.data?.courses || []
      
      // Pre-build first 10 popular courses
      return courses.slice(0, 10).map((course: any) => ({
        id: course.id,
      }))
    }
  } catch (error) {
    console.error('Error fetching courses for static generation:', error)
  }
  
  // Fallback to empty array
  return []
}

// Revalidate every 5 minutes
export const revalidate = 300

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const courseId = resolvedParams.id
  
  return (
    <div className="min-h-screen">
      <CourseDetailPage courseId={courseId} />
    </div>
  )
}
