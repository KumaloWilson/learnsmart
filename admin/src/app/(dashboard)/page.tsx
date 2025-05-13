"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, BookOpen, GraduationCap, UserCog } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboard } from "@/hooks/use-dashboard"

export default function Dashboard() {
  const { overview,recentActivity, systemHealth, isLoading, loadOverview } = useDashboard()

  useEffect(() => {
    loadOverview()
  }, [loadOverview])

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
            {isLoading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview?.totalStudents || 0}</div>
                <p className="text-xs text-muted-foreground">{overview?.activeStudents || 0} active students</p>
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
            {isLoading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview?.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground">Across {overview?.totalPrograms || 0} programs</p>
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
            {isLoading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview?.totalLecturers || 0}</div>
                <p className="text-xs text-muted-foreground">{overview?.activeLecturers || 0} active lecturers</p>
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
            {isLoading.overview ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{overview?.totalPrograms || 0}</div>
                <p className="text-xs text-muted-foreground">Across {overview?.totalDepartments || 0} departments</p>
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
            
            {isLoading.overview ? (
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
                {recentActivity ? (
                  <>
                  {recentActivity.recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="border-b pb-2">
                    <p className="text-sm font-medium">New enrollment: {enrollment.studentName}</p>
                    <p className="text-xs text-muted-foreground">Program: {enrollment.programName}</p>
                    </div>
                  ))}
                  {recentActivity.recentAssessments.map((assessment) => (
                    <div key={assessment.id} className="border-b pb-2">
                    <p className="text-sm font-medium">{assessment.title}</p>
                    <p className="text-xs text-muted-foreground">Course: {assessment.courseName} - Due: {assessment.dueDate}</p>
                    </div>
                  ))}
                  {recentActivity.recentUsers.map((user) => (
                    <div key={user.id} className="border-b pb-2">
                    <p className="text-sm font-medium">New {user.role}: {user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">Added: {user.createdAt}</p>
                    </div>
                  ))}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
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
            {isLoading.overview ? (
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
                <p className="text-sm font-medium">System Status</p>
                <p className="text-xs text-muted-foreground">{systemHealth?.status || 'Unknown'}</p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">API Requests</p>
                <p className="text-xs text-muted-foreground">
                Success: {systemHealth?.apiRequests.successful || 0} | 
                Failed: {systemHealth?.apiRequests.failed || 0}
                </p>
              </div>
              <div className="border-b pb-2">
                <p className="text-sm font-medium">Memory Usage</p>
                <p className="text-xs text-muted-foreground">
                {Math.round((systemHealth?.memoryUsage.heapUsed || 0) / 1024 / 1024)}MB / 
                {Math.round((systemHealth?.memoryUsage.heapTotal || 0) / 1024 / 1024)}MB
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-xs text-muted-foreground">{systemHealth?.lastBackup || 'Never'}</p>
              </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
