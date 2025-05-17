"use client"

// Update the attendance page to use real API data

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Plus, Filter, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses, useAttendance } from "@/lib/auth/hooks"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { AttendanceRecord } from "@/lib/auth/types"

export default function AttendancePage() {
  const router = useRouter()
  const { lecturerProfile } = useAuth()
  const lecturerId = lecturerProfile?.id || ""
  const { getCourses, courses, isLoading: coursesLoading } = useCourses()
  const { getAttendanceRecords, attendanceRecords, isLoading: attendanceLoading } = useAttendance()
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [semesterId, setSemesterId] = useState<string>("")
  const [attendanceStats, setAttendanceStats] = useState<any>(null)
  const [isStatsLoading, setIsStatsLoading] = useState(false)

  useEffect(() => {
    if (lecturerId) {
      getCourses(lecturerId)
    }
  }, [lecturerId, getCourses])

  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].courseId)
      setSemesterId(courses[0].semesterId)
    }
  }, [courses, selectedCourseId])

  useEffect(() => {
    const fetchAttendance = async () => {
      if (lecturerId && selectedCourseId) {
        const filters: any = {
          lecturerProfileId: lecturerId,
          courseId: selectedCourseId,
        }

        if (semesterId) {
          filters.semesterId = semesterId
        }

        if (selectedDate) {
          filters.startDate = new Date(selectedDate.setHours(0, 0, 0, 0))
          filters.endDate = new Date(selectedDate.setHours(23, 59, 59, 999))
        }

        await getAttendanceRecords(filters)
      }
    }

    fetchAttendance()
  }, [lecturerId, selectedCourseId, semesterId, selectedDate, getAttendanceRecords])

  useEffect(() => {
    const fetchStats = async () => {
      if (selectedCourseId && semesterId) {
        setIsStatsLoading(true)
        try {
          const response = await fetch(`/api/attendance/statistics/course/${selectedCourseId}/semester/${semesterId}`)
          if (response.ok) {
            const data = await response.json()
            setAttendanceStats(data)
          }
        } catch (error) {
          console.error("Failed to fetch attendance statistics:", error)
        } finally {
          setIsStatsLoading(false)
        }
      }
    }

    fetchStats()
  }, [selectedCourseId, semesterId])

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId)
    // Find the semester ID for the selected course
    const course = courses.find((c) => c.courseId === courseId)
    if (course) {
      setSemesterId(course.semesterId)
    }
  }

  const isLoading = coursesLoading || attendanceLoading

  if (isLoading && !attendanceRecords) {
    return (
      <PageContainer title="Attendance" description="Loading attendance data...">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Attendance" description="Track and manage student attendance">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={selectedCourseId} onValueChange={handleCourseChange}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.courseId} value={course.courseId}>
                {course.courseCode}: {course.courseName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full md:w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
          </PopoverContent>
        </Popover>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => router.push(`/attendance/take?courseId=${selectedCourseId}&semesterId=${semesterId}`)}>
            <Plus className="mr-2 h-4 w-4" /> Take Attendance
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <CardDescription>All courses</CardDescription>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {attendanceStats ? `${attendanceStats.attendancePercentage}%` : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">Based on all recorded sessions</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <CardDescription>Recorded sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">{attendanceStats ? attendanceStats.totalClasses : "0"}</div>
                <p className="text-xs text-muted-foreground">
                  {attendanceStats
                    ? `${attendanceStats.totalPhysicalClasses} physical, ${attendanceStats.totalVirtualClasses} virtual`
                    : "No classes recorded"}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CardDescription>Present vs. Absent</CardDescription>
          </CardHeader>
          <CardContent>
            {isStatsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {attendanceStats
                    ? `${attendanceStats.presentCount}/${attendanceStats.presentCount + attendanceStats.absentCount}`
                    : "0/0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {attendanceStats ? `${attendanceStats.absentCount} absences recorded` : "No attendance data"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {attendanceRecords && attendanceRecords.length > 0 ? (
        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record: AttendanceRecord) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.date), "PPP")}</TableCell>
                  <TableCell>{record.topic}</TableCell>
                  <TableCell>
                    {record.studentProfile
                      ? `${record.studentProfile.user.firstName} ${record.studentProfile.user.lastName} (${record.studentProfile.studentId})`
                      : "Unknown Student"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Checkbox checked={record.isPresent} disabled className="mr-2" />
                      <span>{record.isPresent ? "Present" : "Absent"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{record.notes || "No notes"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/attendance/${record.id}`)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No attendance records found for the selected criteria.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push(`/attendance/take?courseId=${selectedCourseId}&semesterId=${semesterId}`)}
          >
            Take Attendance
          </Button>
        </div>
      )}
    </PageContainer>
  )
}
