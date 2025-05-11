import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CourseDetails } from "@/components/courses/course-details"
import { CourseDetailsSkeleton } from "@/components/skeletons/course-details-skeleton"
import { CourseTabs } from "@/components/courses/course-tabs"
import { getCourseDetails } from "@/lib/api/courses-api"

export const metadata: Metadata = {
  title: "Course Details | Learn Smart",
  description: "View course details and materials",
}

interface CoursePageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const courseId = params.id

  try {
    // This is a server component, so we can fetch data directly
    const course = await getCourseDetails(courseId)

    return (
      <DashboardShell>
        <Suspense fallback={<CourseDetailsSkeleton />}>
          <CourseDetails course={course} />
        </Suspense>

        <div className="mt-6">
          <CourseTabs courseId={courseId} />
        </div>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error fetching course:", error)
    notFound()
  }
}
