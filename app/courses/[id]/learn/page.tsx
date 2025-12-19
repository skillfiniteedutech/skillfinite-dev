import { Suspense } from "react"
import CourseLearningPage from "@/components/CourseLearningPage"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>}>
            <CourseLearningPage courseId={resolvedParams.id} />
        </Suspense>
    )
}
