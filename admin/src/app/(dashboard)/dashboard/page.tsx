"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, BookOpen, GraduationCap, UserCog } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  // Use local state instead of Redux for initial load
  const [isLoading, setIsLoading] = useState(true)
  const [overview, setOverview] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalPrograms: 0,
    totalDepartments: 0,
    activeStudents: 0,
    activeLecturers: 0,
  })

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setOverview({
        totalStudents: 250,
        totalLecturers: 45,
        totalCourses: 120,
        totalPrograms: 15,
        totalDepartments: 8,
        activeStudents: 230,
        activeLecturers: 40,
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the SmartLearn Admin Portal</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalStudents}</div>
                <p className="text-xs text-muted-foreground">{overview.activeStudents} active students</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalCourses}</div>
                <p className="text-xs text-muted-foreground">Across {overview.totalPrograms} programs</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lecturers</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalLecturers}</div>
                <p className="text-xs text-muted-foreground">{overview.activeLecturers} active lecturers</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview.totalPrograms}</div>
                <p className="text-xs text-muted-foreground">Across {overview.totalDepartments} departments</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>System activities in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border-b pb-2">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">New student registration</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Course schedule updated</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">New lecturer added</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Department meeting scheduled</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled for this week</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border-b pb-2">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Faculty Meeting</p>
                  <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">End of Semester Review</p>
                  <p className="text-xs text-muted-foreground">Friday, 2:00 PM</p>
                </div>
                <div>
                  <p className="text-sm font-medium">New Student Orientation</p>
                  <p className="text-xs text-muted-foreground">Saturday, 9:00 AM</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
