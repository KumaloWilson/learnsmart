"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, LineChart, Users, Video, Loader2, ExternalLink } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useDashboard } from "@/lib/auth/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate, formatTime } from "@/lib/utils"

export default function Dashboard() {
  const { lecturerProfile } = useAuth()
  const { getDashboard, dashboardData, isLoading, error } = useDashboard()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      if (lecturerProfile?.id) {
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
  }, [lecturerProfile, getDashboard])

  if (isInitialLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome, {dashboardData?.lecturer?.name || lecturerProfile?.title + " " + lecturerProfile?.bio.split(" ")[0]}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">{dashboardData?.courses?.length || 0} active this semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled in your courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary?.upcomingClassesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.upcomingClasses?.length
                ? `Next: ${formatDate(dashboardData.upcomingClasses[0].startTime)}`
                : "No upcoming classes"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+2% from last semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Courses you are teaching this semester</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.courses && dashboardData.courses.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.courses.map((course) => (
                  <div key={course.id} className="flex items-center">
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.code} • {course.studentCount} students
                      </p>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/courses" className="text-sm text-primary hover:underline flex items-center justify-end">
                    View all courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No courses assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Classes</CardTitle>
            <CardDescription>Your scheduled classes for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboardData?.upcomingClasses && dashboardData.upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center">
                    <div className="mr-4 rounded-full bg-primary/10 p-2">
                      <Video className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{classItem.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {classItem.courseCode} • {formatDate(classItem.startTime)}, {formatTime(classItem.startTime)} -{" "}
                        {formatTime(classItem.endTime)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={classItem.meetingLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" /> Join
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming classes scheduled</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
