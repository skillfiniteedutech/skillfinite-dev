import { Suspense } from "react";
import MyCoursesPage from "@/components/MyCoursesPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MyCoursesPage />
    </Suspense>
  );
}
