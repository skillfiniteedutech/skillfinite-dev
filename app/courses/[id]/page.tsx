import { Suspense } from "react"
import CourseDetailPage from "@/components/CourseDetailPage"

// Generate static params for common courses or use fallback
export async function generateStaticParams() {
  // Return empty array to make fully dynamic
  // Or return some common course IDs if you want them pre-built
  return []
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading course...</div>}>
            <CourseDetailPage courseId={resolvedParams.id} />
        </Suspense>
    )
}
