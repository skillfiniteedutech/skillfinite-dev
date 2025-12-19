'use client'

import { Suspense } from "react"
import { useParams } from "next/navigation"
import CourseDetailPage from "@/components/CourseDetailPage"

export default function Page() {
    const params = useParams()
    const courseId = params.id as string
    
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading course...</div>}>
            <CourseDetailPage courseId={courseId} />
        </Suspense>
    )
}
