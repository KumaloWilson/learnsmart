"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchAttendanceRecords } from "@/features/attendance/redux/attendanceSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"
import { AttendanceCalendar } from "@/features/attendance/components/attendance-calendar"
import { AttendanceStats } from "@/features/attendance/components/attendance-stats"

export function Attendance() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { records, isLoading, error } = useAppSelector((state) => state.attendance)

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      dispatch(
        fetchAttendanceRecords({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken])

  if (isLoading || !studentProfile) {
    return <AttendanceSkeletonLoader />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!records.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">Track your attendance records for all courses.</p>
        <Card>
          <CardHeader>
            <CardTitle>No Attendance Records</CardTitle>
            <CardDescription>You don't have any attendance records yet.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">Track your attendance records for all courses.</p>
      </div>

      <AttendanceStats records={records} />
      <AttendanceCalendar records={records} />
    </div>
  )
}

function AttendanceSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full" />
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-4 w-32" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-80 w-full md:w-1/2" />
            <div className="w-full md:w-1/2 space-y-4">
              <Skeleton className="h-6 w-48" />
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
