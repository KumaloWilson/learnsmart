"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { AtRiskStudentsChart } from "@/components/at-risk-students-chart"
import { CourseEnrollmentChart } from "@/components/course-enrollment-chart"
import { useAuth } from "@/hooks/use-auth"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    atRiskStudents: null,
    courseEnrollments: null,
    recentActivity: null,
  })
  const [isDataLoading, setIsDataLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAuthenticated || isLoading) return

      setIsDataLoading(true)
      try {
        const [stats, atRiskStudents, courseEnrollments, recentActivity] = await Promise.all([
          api.dashboard.getStats(),
          api.dashboard.getAtRiskStudentsData(),
          api.dashboard.getCourseEnrollmentData(),
          api.dashboard.getRecentActivity(),
        ])

        setDashboardData({
          stats,
          atRiskStudents,
          courseEnrollments,
          recentActivity,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchDashboardData()
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminSidebar />
      <div className="flex-1 lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <PageHeader heading="Dashboard" subheading="Welcome to the Learn Smart admin portal" />

          <DashboardStats data={dashboardData.stats} isLoading={isDataLoading} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-6">
            <AtRiskStudentsChart data={dashboardData.atRiskStudents} isLoading={isDataLoading} />
            <CourseEnrollmentChart data={dashboardData.courseEnrollments} isLoading={isDataLoading} />
          </div>

          <div className="mt-6">
            <RecentActivity data={dashboardData.recentActivity} isLoading={isDataLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}
