import { Suspense } from "react"
import CourseDetailPage from "@/components/CourseDetailPage"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <CourseDetailPage courseId={resolvedParams.id} />
        </Suspense>
    )
}
