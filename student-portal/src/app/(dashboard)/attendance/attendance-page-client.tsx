"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { AttendanceOverview } from "@/components/attendance/attendance-overview"
import { AttendanceOverviewSkeleton } from "@/components/skeletons/attendance-overview-skeleton"
import { AttendanceFilters } from "@/components/attendance/attendance-filters"
import { AttendanceDetails } from "@/components/attendance/attendance-details"
import { AttendanceDetailsSkeleton } from "@/components/skeletons/attendance-details-skeleton"
import { getEnrolledCourses } from "@/lib/api/courses-api"
import { getAttendanceData } from "@/lib/api/attendance-api"

export default function AttendancePageClient() {
  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([])
  const [filters, setFilters] = useState<{
    courseId?: string
    startDate?: Date
    endDate?: Date
  }>({})
  const [attendanceData, setAttendanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesData = await getEnrolledCourses()
        setCourses(
          coursesData.map((course) => ({
            id: course.id,
            name: course.name,
          })),
        )
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      }
    }

    fetchCourses()
  }, [])

  useEffect(() => {
    async function fetchAttendanceData() {
      try {
        setIsLoading(true)
        const data = await getAttendanceData(filters)
        setAttendanceData(data)
      } catch (error) {
        console.error("Failed to fetch attendance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendanceData()
  }, [filters])

  const handleFilterChange = (newFilters: { courseId?: string; startDate?: Date; endDate?: Date }) => {
    setFilters(newFilters)
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Attendance" text="Track your attendance for all courses" />

      <AttendanceFilters courses={courses} onFilterChange={handleFilterChange} />

      <div className="grid gap-6">
        {isLoading ? (
          <>
            <AttendanceOverviewSkeleton />
            <AttendanceDetailsSkeleton />
          </>
        ) : (
          <>
            <AttendanceOverview/>
            <AttendanceDetails/>
          </>
        )}
      </div>
    </DashboardShell>
  )
}
