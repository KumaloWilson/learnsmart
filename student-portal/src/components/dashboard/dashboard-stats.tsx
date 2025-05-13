"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { getStudentDashboard } from "@/lib/api/student-portal-api"
import { BookOpen, Calendar, Award, Clock } from "lucide-react"

export function DashboardStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    upcomingAssessments: 0,
    attendancePercentage: 0,
    overallProgress: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.studentProfileId) return

      try {
        const dashboardData = await getStudentDashboard(user.studentProfileId)
        setStats({
          enrolledCourses: dashboardData.enrollments?.length || 0,
          upcomingAssessments: dashboardData.upcomingAssessments?.length || 0,
          attendancePercentage:
            dashboardData.attendanceSummary?.length > 0
              ? (dashboardData.attendanceSummary.reduce(
                  (sum: number, record: any) => sum + (record.isPresent ? 1 : 0),
                  0,
                ) /
                  dashboardData.attendanceSummary.length) *
                100
              : 0,
          overallProgress: dashboardData.overallProgress || 0,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user?.studentProfileId])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "-" : stats.enrolledCourses}</div>
          <p className="text-xs text-muted-foreground">Active courses this semester</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Assessments</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "-" : stats.upcomingAssessments}</div>
          <p className="text-xs text-muted-foreground">Due in the next 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "-" : `${stats.attendancePercentage.toFixed(1)}%`}</div>
          <Progress
            value={stats.attendancePercentage}
            className="mt-2"
            indicatorColor={
              stats.attendancePercentage >= 90
                ? "bg-success"
                : stats.attendancePercentage >= 75
                  ? "bg-primary"
                  : stats.attendancePercentage >= 60
                    ? "bg-warning"
                    : "bg-destructive"
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? "-" : `${stats.overallProgress.toFixed(1)}%`}</div>
          <Progress
            value={stats.overallProgress}
            className="mt-2"
            indicatorColor={
              stats.overallProgress >= 90
                ? "bg-success"
                : stats.overallProgress >= 75
                  ? "bg-primary"
                  : stats.overallProgress >= 60
                    ? "bg-warning"
                    : "bg-destructive"
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
