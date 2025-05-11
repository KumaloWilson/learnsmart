"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store"
import {
  fetchOverviewStats,
  fetchEnrollmentStats,
  fetchCourseStats,
  fetchRecentActivity,
} from "@/store/slices/dashboard-slice"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { CourseEnrollmentChart } from "@/components/course-enrollment-chart"
import { AtRiskStudentsChart } from "@/components/at-risk-students-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { isAuthenticated } from "@/lib/auth-utils"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const { overviewStats, enrollmentStats, courseStats, recentActivity, isLoading, error } = useAppSelector(
    (state) => state.dashboard,
  )
  const { toast } = useToast()

  // Check authentication on mount only
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      setAuthenticated(authStatus)

      if (!authStatus) {
        router.push("/login")
      }

      setLoading(false)
    }

    checkAuth()
  }, [router])

  // Fetch dashboard data only when authenticated
  useEffect(() => {
    if (authenticated && !loading) {
      const fetchDashboardData = async () => {
        try {
          await dispatch(fetchOverviewStats())
          await dispatch(fetchEnrollmentStats())
          await dispatch(fetchCourseStats())
          await dispatch(fetchRecentActivity(5))
        } catch (err) {
          console.error("Error fetching dashboard data:", err)
        }
      }

      fetchDashboardData()
    }
  }, [dispatch, authenticated, loading])

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  // Process activities only when needed
  const processedActivities = recentActivity
    ? [
        ...(recentActivity.recentEnrollments || []).map((item) => ({
          id: item.id,
          type: "enrollment",
          description: `Enrolled in ${item.course.name}`,
          timestamp: item.createdAt,
          userId: "",
          userName: `${item.studentProfile.user.firstName} ${item.studentProfile.user.lastName}`,
        })),
        ...(recentActivity.recentAssessments || []).map((item) => ({
          id: item.id,
          type: "assessment",
          description: `Created assessment "${item.title}" for ${item.course.name}`,
          timestamp: item.createdAt,
          userId: "",
          userName: `${item.lecturerProfile.user.firstName} ${item.lecturerProfile.user.lastName}`,
        })),
        ...(recentActivity.recentUsers || []).map((item) => ({
          id: item.id,
          type: "user",
          description: `New ${item.role} registered`,
          timestamp: item.createdAt,
          userId: item.id,
          userName: `${item.firstName} ${item.lastName}`,
        })),
      ]
    : []

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (redirect happens in useEffect)
  if (!authenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome to the LearnSmart admin portal</p>
        </div>

        {isLoading && !overviewStats ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : overviewStats ? (
          <DashboardStats stats={overviewStats} />
        ) : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Recent Activity</h2>
            {isLoading && !recentActivity ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : recentActivity ? (
              <RecentActivity activities={processedActivities} />
            ) : null}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Course Enrollment</h2>
            {isLoading && !courseStats ? (
              <Skeleton className="h-64 w-full" />
            ) : courseStats ? (
              <CourseEnrollmentChart
                data={courseStats.popularCourses.map((item) => ({
                  name: item.courseName,
                  total: item.enrollmentCount,
                }))}
              />
            ) : null}
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Enrollment by Program</h2>
          {isLoading && !enrollmentStats ? (
            <Skeleton className="h-64 w-full" />
          ) : enrollmentStats ? (
            <AtRiskStudentsChart
              data={enrollmentStats.enrollmentsByProgram.map((item) => ({
                name: item.programName,
                value: item.count,
              }))}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
