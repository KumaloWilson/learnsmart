"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Calendar, ClipboardList, Users, AlertTriangle } from "lucide-react"

interface DashboardStats {
  totalCourses: number
  totalStudents: number
  upcomingClasses: number
  pendingAssignments: number
  atRiskStudentsCount: number
}

export function LecturerDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from API
    const fetchStats = async () => {
      try {
        // Mock data for demonstration
        const mockStats = {
          totalCourses: 5,
          totalStudents: 127,
          upcomingClasses: 8,
          pendingAssignments: 12,
          atRiskStudentsCount: 7,
        }

        // Simulate API delay
        setTimeout(() => {
          setStats(mockStats)
          setLoading(false)
        }, 1000)

        // Real API call would be:
        // const response = await fetch('/api/lecturer/dashboard/stats')
        // const data = await response.json()
        // setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <Skeleton className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
          <p className="text-xs text-muted-foreground">Active courses this semester</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
          <p className="text-xs text-muted-foreground">Total enrolled students</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.upcomingClasses || 0}</div>
          <p className="text-xs text-muted-foreground">Classes in next 7 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.pendingAssignments || 0}</div>
          <p className="text-xs text-muted-foreground">Assignments to be graded</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats?.atRiskStudentsCount || 0}</div>
          <p className="text-xs text-muted-foreground">Students needing attention</p>
        </CardContent>
      </Card>
    </div>
  )
}
