import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AssessmentsList } from "@/components/assessments/assessments-list"
import { AssessmentsListSkeleton } from "@/components/skeletons/assessments-list-skeleton"
import { AssessmentFilters } from "@/components/assessments/assessment-filters"
import { getEnrolledCourses } from "@/lib/api/courses-api"
import { getAssessments } from "@/lib/api/assessments-api"

export const metadata: Metadata = {
  title: "Assessments | Learn Smart",
  description: "View and submit your assessments",
}

async function getCourses() {
  try {
    const courses = await getEnrolledCourses()
    return courses.map((course) => ({
      id: course.id,
      name: course.name,
    }))
  } catch (error) {
    console.error("Failed to fetch courses:", error)
    return []
  }
}

async function getAssessmentsList() {
  try {
    return await getAssessments()
  } catch (error) {
    console.error("Failed to fetch assessments:", error)
    return []
  }
}

export default async function AssessmentsPage() {
  const courses = await getCourses()
  const assessments = await getAssessmentsList()

  return (
    <DashboardShell>
      <DashboardHeader heading="Assessments" text="View and submit your course assessments" />

      <AssessmentFilters courses={courses} />

      <Suspense fallback={<AssessmentsListSkeleton />}>
        <AssessmentsList assessments={assessments} />
      </Suspense>
    </DashboardShell>
  )
}
