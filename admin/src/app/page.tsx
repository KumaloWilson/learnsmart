"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchDashboardStats } from "@/store/slices/dashboard-slice"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { CourseEnrollmentChart } from "@/components/course-enrollment-chart"
import { AtRiskStudentsChart } from "@/components/at-risk-students-chart"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { stats, isLoading, error } = useAppSelector((state) => state.dashboard)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : stats ? (
          <DashboardStats stats={stats} />
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.recentActivities ? (
              <RecentActivity activities={stats.recentActivities} />
            ) : null}
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Course Enrollment</h2>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : stats?.courseEnrollmentData ? (
              <CourseEnrollmentChart data={stats.courseEnrollmentData} />
            ) : null}
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">At-Risk Students by Program</h2>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : stats?.atRiskStudentsData ? (
            <AtRiskStudentsChart data={stats.atRiskStudentsData} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
