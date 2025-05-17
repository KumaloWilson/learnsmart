"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Download, Loader2, Users } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useVirtualClasses, useVirtualClassAttendance } from "@/lib/auth/hooks"
import { VirtualClassAttendanceTable } from "@/components/virtual-class-attendance-table"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function VirtualClassAttendancePage() {
  const { id } = useParams()
  const { lecturerProfile } = useAuth()
  const { getUpcomingVirtualClasses, virtualClasses, isLoading } = useVirtualClasses()
  const {
    getVirtualClassAttendance,
    getVirtualClassAttendanceStatistics,
    attendance,
    statistics,
    isLoading: isLoadingAttendance,
  } = useVirtualClassAttendance()
  const [virtualClass, setVirtualClass] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && id) {
        try {
          // Fetch virtual classes if not already loaded
          if (virtualClasses.length === 0) {
            await getUpcomingVirtualClasses(lecturerProfile.id)
          }

          // Find the current virtual class
          const currentClass = virtualClasses.find((vc) => vc.id === id)
          if (currentClass) {
            setVirtualClass(currentClass)

            // Fetch attendance data
            await getVirtualClassAttendance(id as string)
            await getVirtualClassAttendanceStatistics(id as string)
          }
        } catch (err) {
          console.error("Error fetching virtual class data:", err)
        }
      }
    }

    fetchData()
  }, [
    lecturerProfile,
    id,
    virtualClasses,
    getUpcomingVirtualClasses,
    getVirtualClassAttendance,
    getVirtualClassAttendanceStatistics,
  ])

  const exportAttendance = () => {
    if (!attendance || attendance.length === 0) return

    // Create CSV content
    const headers = ["Student ID", "Name", "Email", "Join Time", "Leave Time", "Duration (mins)", "Present", "Notes"]
    const rows = attendance.map((record) => [
      record.studentProfile.studentId,
      `${record.studentProfile.user.firstName} ${record.studentProfile.user.lastName}`,
      record.studentProfile.user.email,
      record.joinTime ? new Date(record.joinTime).toLocaleString() : "N/A",
      record.leaveTime ? new Date(record.leaveTime).toLocaleString() : "Still in session",
      record.durationMinutes?.toString() || "N/A",
      record.isPresent ? "Yes" : "No",
      record.notes || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `attendance_${virtualClass?.course?.code || "class"}_${new Date().toISOString().split("T")[0]}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading virtual class details...</p>
        </div>
      </div>
    )
  }

  if (!virtualClass) {
    return (
      <PageContainer title="Class Attendance" description="View student attendance for this virtual class">
        <Alert variant="destructive">
          <AlertDescription>Virtual class not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/virtual-classes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Virtual Classes
            </Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`${virtualClass.title} - Attendance`}
      description="View student attendance for this virtual class"
    >
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/virtual-classes/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" onClick={exportAttendance} disabled={!attendance || attendance.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Export Attendance
        </Button>
      </div>

      {isLoadingAttendance ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {statistics ? (
            <>
              <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.totalStudents}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Present</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.presentStudents}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Absent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.absentStudents}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.attendancePercentage}%</div>
                    <Progress value={statistics.attendancePercentage} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance Details</CardTitle>
                  <CardDescription>Student attendance records for this virtual class</CardDescription>
                </CardHeader>
                <CardContent>
                  <VirtualClassAttendanceTable attendance={attendance} />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Attendance Data</CardTitle>
                <CardDescription>There is no attendance data available for this virtual class</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Users className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground">No attendance records found</p>
                {virtualClass.status === "scheduled" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Attendance records will be available after the class starts
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </PageContainer>
  )
}
