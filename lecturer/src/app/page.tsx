import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import { LecturerDashboardStats } from "@/components/lecturer-dashboard-stats"
import { UpcomingClasses } from "@/components/upcoming-classes"
import { AssessmentOverview } from "@/components/assessment-overview"
import { StudentEngagementChart } from "@/components/student-engagement-chart"
import { AtRiskStudentsTable } from "@/components/at-risk-students-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <PageHeader
        title="Lecturer Dashboard"
        description="Overview of your courses, students, and teaching activities"
      />

      <Suspense fallback={<Skeleton className="h-[120px] w-full" />}>
        <LecturerDashboardStats />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your scheduled classes for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <UpcomingClasses />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Assessment Overview</CardTitle>
            <CardDescription>Status of your assessments and submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <AssessmentOverview />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Student Engagement</CardTitle>
            <CardDescription>Engagement metrics across your courses</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <StudentEngagementChart />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>At-Risk Students</CardTitle>
            <CardDescription>Students who may need additional support</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <AtRiskStudentsTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
