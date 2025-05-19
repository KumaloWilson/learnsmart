"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchDashboardData } from "@/features/dashboard/redux/dashboardSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, BookOpen, GraduationCap, BarChart3, BookMarked, Lightbulb, Video, Clock } from "lucide-react"
import { RecommendedResources } from "@/features/dashboard/components/recommended-resources"
import { CurrentCourses } from "@/features/dashboard/components/current-courses"
import { AcademicSummary } from "@/features/dashboard/components/academic-summary"
import { UpcomingClasses } from "@/features/dashboard/components/upcoming-classes"
import { AttendanceOverview } from "@/features/dashboard/components/attendance-overview"
import { AIRecommendationsPreview } from "@/features/dashboard/components/ai-recommendations-preview"
import { Skeleton } from "@/components/ui/skeleton"
import { PerformanceInsights } from "../components/perfomance-insights"

export function Dashboard() {
  const dispatch = useAppDispatch()
  const { user, studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { data: dashboardData, isLoading } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      dispatch(
        fetchDashboardData({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken])

  // Show skeleton loading state if data isn't available yet
  if (!user || !studentProfile) {
    return <DashboardSkeleton />
  }

  const { currentSemesterPerformance, activeSemester, program } = studentProfile

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.firstName}!</h1>
        <p className="text-muted-foreground">Here's an overview of your academic progress and learning journey.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSemesterPerformance.gpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">CGPA: {currentSemesterPerformance.cgpa.toFixed(2)}</p>
            <Progress value={(currentSemesterPerformance.gpa / 4) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold line-clamp-1">{program.name}</div>
            <p className="text-xs text-muted-foreground">
              {program.code} • Year {studentProfile.currentLevel} of {program.durationYears}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Semester</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-bold">{activeSemester.name}</div>
            <p className="text-xs text-muted-foreground">
              {new Date(activeSemester.startDate).toLocaleDateString()} -{" "}
              {new Date(activeSemester.endDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSemesterPerformance.earnedCredits}/{currentSemesterPerformance.totalCredits}
            </div>
            <p className="text-xs text-muted-foreground">
              {((currentSemesterPerformance.earnedCredits / currentSemesterPerformance.totalCredits) * 100).toFixed(0)}%
              completed
            </p>
            <Progress
              value={(currentSemesterPerformance.earnedCredits / currentSemesterPerformance.totalCredits) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* New section for upcoming classes */}
      {dashboardData?.upcomingVirtualClasses && dashboardData.upcomingVirtualClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span>Upcoming Virtual Classes</span>
          </h2>
          <UpcomingClasses classes={dashboardData.upcomingVirtualClasses} />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="courses" className="space-y-4">
            <TabsList>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Current Courses</span>
              </TabsTrigger>
              <TabsTrigger value="recommendations" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>Recommendations</span>
              </TabsTrigger>
              <TabsTrigger value="academic" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Academic Summary</span>
              </TabsTrigger>
              {dashboardData?.performanceSummary && dashboardData.performanceSummary.length > 0 && (
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Performance</span>
                </TabsTrigger>
              )}
              {dashboardData?.attendanceSummary && dashboardData.attendanceSummary.length > 0 && (
                <TabsTrigger value="attendance" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Attendance</span>
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <CurrentCourses enrollments={studentProfile.currentEnrollments} />
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <RecommendedResources recommendations={studentProfile.learningRecommendations} />
            </TabsContent>

            <TabsContent value="academic" className="space-y-4">
              <AcademicSummary
                academicRecords={studentProfile.academicRecords}
                currentPerformance={studentProfile.currentSemesterPerformance}
              />
            </TabsContent>

            {dashboardData?.performanceSummary && dashboardData.performanceSummary.length > 0 && (
              <TabsContent value="performance" className="space-y-4">
                <PerformanceInsights performanceSummary={dashboardData.performanceSummary} />
              </TabsContent>
            )}

            {dashboardData?.attendanceSummary && dashboardData.attendanceSummary.length > 0 && (
              <TabsContent value="attendance" className="space-y-4">
                <AttendanceOverview attendanceRecords={dashboardData.attendanceSummary} />
              </TabsContent>
            )}
          </Tabs>
        </div>

        <div className="space-y-6">
          <AIRecommendationsPreview />
        </div>
      </div>
    </div>
  )
}

// Skeleton loading state for the dashboard
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-96" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
