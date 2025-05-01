"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store"
import { 
  fetchOverviewStats, 
  fetchEnrollmentStats, 
  fetchCourseStats, 
  fetchRecentActivity 
} from "@/store/slices/dashboard-slice"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { CourseEnrollmentChart } from "@/components/course-enrollment-chart"
import { AtRiskStudentsChart } from "@/components/at-risk-students-chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const { 
    overviewStats, 
    enrollmentStats, 
    courseStats, 
    recentActivity, 
    isLoading, 
    error 
  } = useAppSelector((state) => state.dashboard)
  const { toast } = useToast()

  // Fix: Adding proper dependency array to prevent infinite fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      await dispatch(fetchOverviewStats())
      await dispatch(fetchEnrollmentStats())
      await dispatch(fetchCourseStats())
      await dispatch(fetchRecentActivity(5))
    }
    
    fetchDashboardData()
    // Empty dependency array means this runs only once on mount
  }, [dispatch])
  
  // Separated error handling to its own effect
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
  const processedActivities = recentActivity ? [
    ...(recentActivity.recentEnrollments || []).map(item => ({
      id: item.id,
      type: 'enrollment',
      description: `Enrolled in ${item.course.name}`,
      timestamp: item.createdAt,
      userId: '',
      userName: `${item.studentProfile.user.firstName} ${item.studentProfile.user.lastName}`
    })),
    ...(recentActivity.recentAssessments || []).map(item => ({
      id: item.id,
      type: 'assessment',
      description: `Created assessment "${item.title}" for ${item.course.name}`,
      timestamp: item.createdAt,
      userId: '',
      userName: `${item.lecturerProfile.user.firstName} ${item.lecturerProfile.user.lastName}`
    })),
    ...(recentActivity.recentUsers || []).map(item => ({
      id: item.id,
      type: 'user',
      description: `New ${item.role} registered`,
      timestamp: item.createdAt,
      userId: item.id,
      userName: `${item.firstName} ${item.lastName}`
    }))
  ] : [];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

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
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
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

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Course Enrollment</h2>
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

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-semibold">Enrollment by Program</h2>
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