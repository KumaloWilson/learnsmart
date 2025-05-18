"use client"

import { useEffect } from "react"
import { CardFooter } from "@/components/ui/card"
import type React from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchDashboard } from "@/lib/redux/slices/dashboardSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { BookOpen, Clock, Trophy, Users, Calendar, Video, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { formatDate, formatTime, getTimeRemaining } from "@/lib/utils/date-utils"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"
import { DashboardData } from "@/lib/types/dashboard.types"

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { user, studentProfile } = useAppSelector((state) => state.auth)
  const { data: dashboardData, isLoading, error } = useAppSelector((state) => state.dashboard)

  useEffect(() => {
    // Fetch dashboard data if not already loaded
    if (!dashboardData && studentProfile) {
      dispatch(fetchDashboard())
    }
  }, [dispatch, dashboardData, studentProfile])

  const content = (
    <div className="flex flex-col gap-8 w-full animate-in fade-in-50 duration-500">
      {isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : !dashboardData ? (
        <Alert className="m-4">
          <AlertDescription>No dashboard data available.</AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Welcome Section */}
          <section className="space-y-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.firstName}!</h1>
              <p className="text-muted-foreground">Continue your learning journey and track your progress.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Program"
                value={studentProfile?.program.code || ""}
                description={studentProfile?.program.name || ""}
                icon={<BookOpen className="h-5 w-5" />}
                trend={`Level ${studentProfile?.currentLevel || ""}`}
              />
              <StatsCard
                title="GPA"
                value={studentProfile?.currentSemesterPerformance.gpa.toString() || "0.0"}
                description="Current semester"
                icon={<Trophy className="h-5 w-5" />}
                trend={`CGPA: ${studentProfile?.currentSemesterPerformance.cgpa || "0.0"}`}
              />
              <StatsCard
                title="Credits"
                value={studentProfile?.currentSemesterPerformance.earnedCredits.toString() || "0"}
                description="Earned credits"
                icon={<Clock className="h-5 w-5" />}
                trend={`Total: ${studentProfile?.currentSemesterPerformance.totalCredits || "0"}`}
              />
              <StatsCard
                title="Semester"
                value={studentProfile?.activeSemester.academicYear.toString() || ""}
                description={studentProfile?.activeSemester.name || ""}
                icon={<Calendar className="h-5 w-5" />}
                trend="Current"
              />
            </div>
          </section>

          {/* Next Virtual Class */}
          {renderNextVirtualClass(dashboardData)}

          {/* Current Courses */}
          {renderCurrentCourses(dashboardData)}

          {/* Performance Summary */}
          {renderPerformanceSummary(dashboardData)}

          {/* Upcoming Virtual Classes */}
          {renderUpcomingVirtualClasses(dashboardData)}

          {/* Attendance Summary */}
          {renderAttendanceSummary(dashboardData)}
        </>
      )}
    </div>
  )

  return <MainLayout>{content}</MainLayout>
}

// Helper function to render the next virtual class section
function renderNextVirtualClass(dashboardData: DashboardData) {
  // Sort upcoming virtual classes by date
  const sortedVirtualClasses = dashboardData.upcomingVirtualClasses
    ? [...dashboardData.upcomingVirtualClasses].sort(
        (a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime(),
      )
    : []

  // Get the next upcoming class
  const nextClass = sortedVirtualClasses[0]

  if (!nextClass) return null

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Next Virtual Class</h2>
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{nextClass.title}</CardTitle>
              <CardDescription className="mt-1">
                {nextClass.course.name} ({nextClass.course.code})
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {getTimeRemaining(nextClass.scheduledStartTime)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formatDate(nextClass.scheduledStartTime)} • {formatTime(nextClass.scheduledStartTime)} -{" "}
                  {formatTime(nextClass.scheduledEndTime)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {nextClass.lecturerProfile.title} {nextClass.lecturerProfile.user.firstName}{" "}
                  {nextClass.lecturerProfile.user.lastName}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{nextClass.description}</p>
            </div>
            <div className="flex flex-col justify-end space-y-3 md:items-end">
              <Button asChild className="gap-2">
                <a href={nextClass.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4" />
                  <span>Join Class</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
              <div className="text-xs text-muted-foreground">
                Platform: {nextClass.meetingConfig.platform} • Passcode: {nextClass.meetingConfig.passcode}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

// Helper function to render current courses section
function renderCurrentCourses(dashboardData: DashboardData) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Current Courses</h2>
      <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardData?.enrollments && dashboardData.enrollments.length > 0 ? (
          dashboardData.enrollments.map((enrollment) => {
            // Find performance data for this course if available
            const performance = dashboardData.performanceSummary.find(
              (summary) => summary.courseId === enrollment.courseId,
            )

            return (
              <CourseCard
                key={enrollment.id}
                title={enrollment.course.name}
                instructor={
                  enrollment.lecturerName ||
                  (enrollment.lecturer
                    ? `${enrollment.lecturer.title} ${enrollment.lecturer.firstName} ${enrollment.lecturer.lastName}`
                    : "Course Instructor")
                }
                progress={performance?.overallPerformance || 0}
                image="/placeholder.svg?height=100&width=200"
                dueDate={enrollment.semester.endDate.split("T")[0]}
                code={enrollment.course.code}
                creditHours={enrollment.course.creditHours}
                courseId={enrollment.courseId}
              />
            )
          })
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-8">No course enrollments found.</div>
        )}
      </div>
    </section>
  )
}

// Helper function to render performance summary section
function renderPerformanceSummary(dashboardData: DashboardData) {
  if (!dashboardData?.performanceSummary || dashboardData.performanceSummary.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Performance Summary</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {dashboardData.performanceSummary.map((performance) => (
          <Card key={performance.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{performance.course.name}</CardTitle>
                <Badge
                  className={
                    performance.performanceCategory === "poor"
                      ? "bg-red-100 text-red-800 hover:bg-red-200 border-none"
                      : performance.performanceCategory === "average"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none"
                        : "bg-green-100 text-green-800 hover:bg-green-200 border-none"
                  }
                >
                  {performance.performanceCategory.charAt(0).toUpperCase() + performance.performanceCategory.slice(1)}
                </Badge>
              </div>
              <CardDescription>{performance.course.code}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Performance</span>
                  <span className="text-sm">{performance.overallPerformance}%</span>
                </div>
                <Progress value={performance.overallPerformance} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Attendance</span>
                  <p className="text-lg font-medium">{performance.attendancePercentage}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Assignments</span>
                  <p className="text-lg font-medium">{performance.assignmentAverage}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Quizzes</span>
                  <p className="text-lg font-medium">{performance.quizAverage}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Strengths</h4>
                <p className="text-sm text-muted-foreground">{performance.strengths}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Areas for Improvement</h4>
                <p className="text-sm text-muted-foreground">{performance.weaknesses}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

// Helper function to render upcoming virtual classes section
function renderUpcomingVirtualClasses(dashboardData: DashboardData) {
  // Sort upcoming virtual classes by date
  const sortedVirtualClasses = dashboardData.upcomingVirtualClasses
    ? [...dashboardData.upcomingVirtualClasses].sort(
        (a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime(),
      )
    : []

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Upcoming Virtual Classes</h2>
      <div className="rounded-lg border bg-card">
        <div className="flex flex-col divide-y">
          {sortedVirtualClasses.length > 0 ? (
            sortedVirtualClasses.map((virtualClass) => (
              <div key={virtualClass.id} className="flex items-center justify-between p-4">
                <div className="flex flex-col">
                  <span className="font-medium">{virtualClass.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {virtualClass.course.name} ({virtualClass.course.code})
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm">
                      {formatDate(virtualClass.scheduledStartTime)} • {formatTime(virtualClass.scheduledStartTime)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
                      {virtualClass.lecturerProfile.user.lastName}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={virtualClass.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Video className="h-3 w-3 mr-1" />
                      Join
                    </a>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No upcoming virtual classes scheduled.</div>
          )}
        </div>
      </div>
    </section>
  )
}

// Helper function to render attendance summary section
function renderAttendanceSummary(dashboardData: DashboardData) {
  if (!dashboardData?.attendanceSummary || dashboardData.attendanceSummary.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Recent Attendance</h2>
      <div className="rounded-lg border bg-card">
        <div className="flex flex-col divide-y">
          {dashboardData.attendanceSummary.map((attendance) => (
            <div key={attendance.id} className="flex items-center justify-between p-4">
              <div className="flex flex-col">
                <span className="font-medium">{attendance.topic}</span>
                <span className="text-sm text-muted-foreground">
                  {attendance.course.name} ({attendance.course.code})
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm">{formatDate(attendance.date)}</span>
                  <span className="text-xs text-muted-foreground">{attendance.notes}</span>
                </div>
                <div>
                  {attendance.isPresent ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: string
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full bg-muted p-2">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs font-medium text-green-500">{trend}</p>
      </CardContent>
    </Card>
  )
}

interface CourseCardProps {
  title: string
  instructor: string
  progress: number
  image: string
  dueDate: string
  code: string
  creditHours: number
  courseId: string
}

function CourseCard({ title, instructor, progress, image, dueDate, code, creditHours, courseId }: CourseCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <img src={image || "/placeholder.svg"} alt={title} className="h-full w-full object-cover" />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded">{code}</span>
        </div>
        <CardDescription>{instructor}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="mt-4 flex justify-between">
          <p className="text-sm text-muted-foreground">Due: {dueDate}</p>
          <p className="text-sm text-muted-foreground">{creditHours} credits</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/courses/${courseId}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
