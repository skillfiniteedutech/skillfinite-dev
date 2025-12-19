import CourseDetailPage from "@/components/CourseDetailPage"

// Simple approach - no generateStaticParams needed
export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const courseId = resolvedParams.id
  
  return <CourseDetailPage courseId={courseId} />
}
