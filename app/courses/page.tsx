import { Metadata } from "next"
import { Suspense } from "react"
import CoursesPage from "@/components/courses-page"

export const metadata: Metadata = {
  title: "Explore Courses - Skillfinite",
  description: "Discover and enroll in professional courses on Skillfinite's modern e-learning platform. Master new skills with expert-led content.",
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CoursesPage />
    </Suspense>
  )
}
