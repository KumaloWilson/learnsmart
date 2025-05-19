"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  BookOpen,
  Calendar,
  LineChart,
  Users,
  Video,
  Loader2,
  ExternalLink,
  ArrowRight,
  Clock,
  BarChart3,
  Bell,
} from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useDashboard } from "@/lib/auth/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate, formatTime } from "@/lib/utils"
import { PageSection } from "@/components/page-container"

export default function Dashboard() {
  const { lecturerProfile } = useAuth()
  const { getDashboard, dashboardData, isLoading, error } = useDashboard()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
console.log("dashboardData", dashboardData)
  useEffect(() => {
    const fetchDashboard = async () => {
      if (lecturerProfile?.id && !isInitialLoading && !dashboardData) {
        try {
          await getDashboard(lecturerProfile.id)
        } catch (err) {
          console.error("Error fetching dashboard:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchDashboard()
  }, [lecturerProfile, getDashboard, dashboardData, isInitialLoading])

  if (isInitialLoading || isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[80vh] ">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-8 space-y-8 animate-fade-in y p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Hello, {dashboardData?.lecturer?.name || lecturerProfile?.title + " " + lecturerProfile?.bio.split(" ")[0]}.
          Here's an overview of your teaching activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Courses"
          value={dashboardData?.summary?.totalCourses || 0}
          description={`${dashboardData?.courses?.length || 0} active this semester`}
          icon={<BookOpen className="h-5 w-5 text-primary" />}
          trend="+2 from last semester"
        />

        <StatCard
          title="Total Students"
          value={dashboardData?.summary?.totalStudents || 0}
          description="Enrolled in your courses"
          icon={<Users className="h-5 w-5 text-primary" />}
          trend="+15 new enrollments"
        />

        <StatCard
          title="Upcoming Classes"
          value={dashboardData?.summary?.upcomingClassesCount || 0}
          description={
            dashboardData?.upcomingClasses?.length
              ? `Next: ${formatDate(dashboardData.upcomingClasses[0].startTime)}`
              : "No upcoming classes"
          }
          icon={<Calendar className="h-5 w-5 text-primary" />}
        />

        <StatCard
          title="Average Performance"
          value="78%"
          description="+2% from last semester"
          icon={<LineChart className="h-5 w-5 text-primary" />}
          trend="Improving"
          trendPositive={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PageSection title="Today's Schedule" description="Your classes for today" className="lg:col-span-2">
          {dashboardData?.upcomingClasses && dashboardData.upcomingClasses.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.upcomingClasses.slice(0, 3).map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{classItem.title}</p>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <BookOpen className="mr-1 h-3.5 w-3.5" />
                        {classItem.courseCode}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        {formatDate(classItem.startTime)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {formatTime(classItem.startTime)} - {formatTime(classItem.endTime)}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild className="ml-2 flex-shrink-0">
                    <a href={classItem.meetingLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" /> Join
                    </a>
                  </Button>
                </div>
              ))}
              <div className="pt-2 flex justify-end">
                <Button variant="ghost" size="sm" asChild className="text-primary">
                  <Link href="/virtual-classes" className="flex items-center">
                    View all classes <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-2">No classes scheduled for today</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/virtual-classes">Schedule a class</Link>
              </Button>
            </div>
          )}
        </PageSection>

        <PageSection title="Student Engagement" description="Recent activity">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">Active Participation</div>
                <div className="text-2xl font-bold">68%</div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Top Performing Courses</div>
              <div className="space-y-2">
                {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                  dashboardData.courses.slice(0, 2).map((course) => (
                    <div key={course.id} className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                      <span className="text-sm">
                        {course.code} - {course.name}
                      </span>
                      <span className="text-sm font-medium text-green-600">92%</span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between items-center p-2 rounded-md bg-muted/30">
                    <span className="text-sm">No course data available</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="ghost" size="sm" asChild className="text-primary">
                <Link href="/performance-analytics" className="flex items-center">
                  View analytics <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PageSection title="Your Courses" description="Courses you are teaching this semester">
          {dashboardData?.courses && dashboardData.courses.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="mr-4 rounded-full bg-primary/10 p-3">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{course.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="mr-3">{course.code}</span>
                      <span className="flex items-center">
                        <Users className="mr-1 h-3.5 w-3.5" />
                        {course.studentCount} students
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="ml-2">
                    <Link href={`/courses/${course.id}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
              <div className="pt-2 flex justify-end">
                <Button variant="ghost" size="sm" asChild className="text-primary">
                  <Link href="/courses" className="flex items-center">
                    View all courses <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-2">No courses assigned yet</p>
              <Button variant="outline" size="sm">
                Request a course
              </Button>
            </div>
          )}
        </PageSection>

        <PageSection title="Recent Notifications" description="Updates from your courses">
          <div className="space-y-4">
            <div className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <Bell className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="font-medium">Assignment Submissions</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <p className="text-sm">15 new submissions for "Data Structures Assignment #3"</p>
            </div>

            <div className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <Users className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="font-medium">Student Request</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <p className="text-sm">Alice Johnson requested feedback on her project proposal</p>
            </div>

            <div className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <p className="font-medium">Schedule Change</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <p className="text-sm">CS201 class on Friday has been moved to Room 302</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="ghost" size="sm" asChild className="text-primary">
                <Link href="/notifications" className="flex items-center">
                  View all notifications <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </PageSection>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendPositive,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: string
  trendPositive?: boolean
}) {
  return (
    <Card className="overflow-hidden card-hover stat-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="rounded-full bg-primary/10 p-1.5">{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
      {trend && (
        <CardFooter className="pt-0">
          <p className={`text-xs ${trendPositive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
            {trend}
          </p>
        </CardFooter>
      )}
    </Card>
  )
}
