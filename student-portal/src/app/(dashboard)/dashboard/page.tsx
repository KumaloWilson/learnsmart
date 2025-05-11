import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingAssessments } from "@/components/dashboard/upcoming-assessments"
import { EnrolledCourses } from "@/components/dashboard/enrolled-courses"
import { RecentMaterials } from "@/components/dashboard/recent-materials"
import { UpcomingClasses } from "@/components/dashboard/upcoming-classes"
import { CourseMasteryOverview } from "@/components/dashboard/course-mastery-overview"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"

export const metadata: Metadata = {
  title: "Dashboard | Learn Smart",
  description: "Student dashboard for Learn Smart platform",
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back to your student portal" />

      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-6">
          <DashboardStats />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2">
              <UpcomingAssessments />
            </div>
            <div className="col-span-1">
              <UpcomingClasses />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <EnrolledCourses />
            <RecentMaterials />
          </div>

          <CourseMasteryOverview />
        </div>
      </Suspense>
    </DashboardShell>
  )
}
