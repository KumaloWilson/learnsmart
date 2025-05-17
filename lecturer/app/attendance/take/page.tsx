"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses } from "@/lib/auth/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"

export default function TakeAttendancePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { lecturerProfile } = useAuth()
  const lecturerId = lecturerProfile?.id || ""

  const courseIdParam = searchParams.get("courseId")
  const semesterIdParam = searchParams.get("semesterId")

  const [courseId, setCourseId] = useState<string>(courseIdParam || "")
  const [semesterId, setSemesterId] = useState<string>(semesterIdParam || "")
  const [date, setDate] = useState<Date>(new Date())
  const [topic, setTopic] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [students, setStudents] = useState<any[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { getCourses, courses, isLoading } = useCourses()

  useEffect(() => {
    if (lecturerId) {
      getCourses(lecturerId)
    }
  }, [lecturerId, getCourses])

  useEffect(() => {
    if (courses && courses.length > 0) {
      // If courseId is not set or not found in courses, use the first course
      if (!courseId || !courses.find((c) => c.courseId === courseId)) {
        setCourseId(courses[0].courseId)
        setSemesterId(courses[0].semesterId)
      }
    }
  }, [courses, courseId])

  useEffect(() => {
    // Get students for the selected course
    if (courseId) {
      const selectedCourse = courses.find((c) => c.courseId === courseId)
      if (selectedCourse && selectedCourse.students) {
        setStudents(selectedCourse.students)

        // Initialize attendance records for all students (present by default)
        const records = selectedCourse.students.map((student) => ({
          studentProfileId: student.id,
          isPresent: true,
          notes: "",
        }))
        setAttendanceRecords(records)
      }
    }
  }, [courseId, courses])

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.studentProfileId === studentId ? { ...record, isPresent } : record)),
    )
  }

  const handleStudentNoteChange = (studentId: string, note: string) => {
    setAttendanceRecords((prev) =>
      prev.map((record) => (record.studentProfileId === studentId ? { ...record, notes: note } : record)),
    )
  }

  const handleSubmit = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic for this session",
        variant: "destructive",
      })
      return
    }

    if (!courseId || !semesterId || !lecturerId) {
      toast({
        title: "Error",
        description: "Missing required information. Please try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        courseId,
        semesterId,
        date: date.toISOString(),
        topic,
        notes,
        lecturerProfileId: lecturerId,
        attendanceRecords,
      }

      await axiosInstance.post("/attendance", payload)

      toast({
        title: "Success",
        description: "Attendance has been recorded successfully",
      })

      router.push("/attendance")
    } catch (error) {
      console.error("Failed to submit attendance:", error)
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <PageContainer title="Take Attendance" description="Loading...">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title="Take Attendance"
      description="Record student attendance for a class session"
      actions={
        <Button variant="outline" onClick={() => router.push("/attendance")}>
          Back to Attendance
        </Button>
      }
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <select
                id="course"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value)
                  const selectedCourse = courses.find((c) => c.courseId === e.target.value)
                  if (selectedCourse) {
                    setSemesterId(selectedCourse.semesterId)
                  }
                }}
                title="Select Course"
                aria-label="Select Course"
              >
                {courses.map((course) => (
                  <option key={course.courseId} value={course.courseId}>
                    {course.courseCode}: {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Introduction to Data Structures"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Session Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this session"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students enrolled in this course.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const attendanceRecord = attendanceRecords.find((r) => r.studentProfileId === student.id)
                    const isPresent = attendanceRecord ? attendanceRecord.isPresent : true
                    const studentNotes = attendanceRecord ? attendanceRecord.notes : ""

                    return (
                      <TableRow key={student.id}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={isPresent}
                            onCheckedChange={(checked) => handleAttendanceChange(student.id, checked === true)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            placeholder="Optional notes"
                            value={studentNotes}
                            onChange={(e) => handleStudentNoteChange(student.id, e.target.value)}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/attendance")}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || students.length === 0 || !topic}>
              {isSubmitting ? "Submitting..." : "Save Attendance"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  )
}