"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Building2, GraduationCap, Users } from "lucide-react"
import { fetchWithAuth } from "@/lib/api-helpers"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"

interface StatsData {
  schoolCount: number
  departmentCount: number
  programCount: number
  courseCount: number
  studentCount: number
  lecturerCount: number
}

export function DashboardStats() {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAuthenticated) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchWithAuth("/dashboard/stats")
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err)
        setError("Failed to load statistics. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Schools</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.schoolCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total schools in the system</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Programs</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.programCount || 0}</div>
              <p className="text-xs text-muted-foreground">Academic programs offered</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.courseCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total courses available</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : error ? (
            <div className="text-sm text-red-500">Error loading data</div>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats?.studentCount || 0}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
