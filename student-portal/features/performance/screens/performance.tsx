"use client"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchPerformanceData } from "@/features/performance/redux/performanceSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle } from "lucide-react"
import { PerformanceChart } from "@/features/performance/components/performance-chart"
import { PerformanceDetails } from "@/features/performance/components/performance-details"

export function Performance() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { performanceData, isLoading, error } = useAppSelector((state) => state.performance)
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")

  useEffect(() => {
    if (studentProfile?.id && accessToken && studentProfile.currentEnrollments.length > 0 && !selectedCourseId) {
      // Set the first course as default
      setSelectedCourseId(studentProfile.currentEnrollments[0].courseId)
    }
  }, [studentProfile, accessToken, selectedCourseId])

  useEffect(() => {
    if (studentProfile?.id && accessToken && selectedCourseId && studentProfile.activeSemester?.id) {
      dispatch(
        fetchPerformanceData({
          studentProfileId: studentProfile.id,
          courseId: selectedCourseId,
          semesterId: studentProfile.activeSemester.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken, selectedCourseId, studentProfile?.activeSemester?.id])

  if (isLoading || !studentProfile) {
    return <PerformanceSkeletonLoader />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!studentProfile.currentEnrollments.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground">Track your academic performance and progress.</p>
        <Card>
          <CardHeader>
            <CardTitle>No Courses</CardTitle>
            <CardDescription>You are not enrolled in any courses to view performance data.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground">Track your academic performance and progress.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
          <CardDescription>Select a course to view detailed performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {studentProfile.currentEnrollments.map((enrollment) => (
                <SelectItem key={enrollment.courseId} value={enrollment.courseId}>
                  {enrollment.courseName} ({enrollment.courseCode})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {performanceData.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <PerformanceChart performanceData={performanceData[0]} />
          <PerformanceDetails performanceData={performanceData[0]} />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Performance Data</CardTitle>
            <CardDescription>
              No performance data is available for the selected course. Please check back later.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}

function PerformanceSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-[300px]" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
