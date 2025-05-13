import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { CoursesList } from "@/components/courses/courses-list"
import { CoursesListSkeleton } from "@/components/skeletons/courses-list-skeleton"
import { CourseFilters } from "@/components/courses/course-filters"
import { getEnrolledCourses } from "@/lib/api/courses-api"
import { getSemesters } from "@/lib/api/student-portal-api"

export const metadata: Metadata = {
  title: "Courses | Learn Smart",
  description: "Manage your enrolled courses",
}

async function getCourses() {
  try {
    return await getEnrolledCourses()
  } catch (error) {
    console.error("Failed to fetch courses:", error)
    return []
  }
}

async function getSemestersList() {
  try {
    const response = await getSemesters()
    return response.map((semester) => ({
      id: semester.id,
      name: semester.name,
    }))
  } catch (error) {
    console.error("Failed to fetch semesters:", error)
    return []
  }
}

async function getProgramsList() {
  try {
    // This is a placeholder - replace with actual API call
    return [
      { id: "prog1", name: "Computer Science" },
      { id: "prog2", name: "Engineering" },
      { id: "prog3", name: "Business Administration" },
    ]
  } catch (error) {
    console.error("Failed to fetch programs:", error)
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()
  const semesters = await getSemestersList()
  const programs = await getProgramsList()

  return (
    <DashboardShell>
      <DashboardHeader heading="My Courses" text="View and manage your enrolled courses" />

      <CourseFilters semesters={semesters} programs={programs} />

      <Suspense fallback={<CoursesListSkeleton />}>
        <CoursesList courses={courses} />
      </Suspense>
    </DashboardShell>
  )
}
