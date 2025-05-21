"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourseDetail } from "@/lib/auth/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, UserPlus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function CourseStudentsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { lecturerProfile } = useAuth()
  const lecturerId = lecturerProfile?.id || ""
  const [searchTerm, setSearchTerm] = useState("")

  // Default semester ID to use until we get the course details
  const defaultSemesterId = "bbfc180e-11ce-48a5-adb6-95b197339bae"
  const [semesterId, setSemesterId] = useState(defaultSemesterId)

  // Use the new API endpoint to get detailed course information
  const { courseDetail, isLoading, error, refetch } = useCourseDetail(lecturerId, courseId, semesterId)

  // Update semesterId if we get it from courseDetail
  useEffect(() => {
    if (courseDetail?.semester?.id) {
      setSemesterId(courseDetail.semester.id)
    }
  }, [courseDetail])

  useEffect(() => {
    if (lecturerId && courseId) {
      refetch()
    }
  }, [lecturerId, courseId, refetch])

  // Filter students based on search term
  const filteredStudents = courseDetail?.students
    ? courseDetail.students.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  if (isLoading) {
    return (
      <PageContainer title="Course Students" loading={true}>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (error || !courseDetail) {
    return (
      <PageContainer title="Course Students">
        <div className="py-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading course details</h2>
          <p className="text-muted-foreground mb-4">{error || "Course information could not be found"}</p>
          <Button onClick={() => router.push("/courses")}>Return to Courses</Button>
        </div>
      </PageContainer>
    )
  }

  const { course, students } = courseDetail

  return (
    <PageContainer title={`Students - ${course.name}`} description={`Course Code: ${course.code}`}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Button variant="outline" onClick={() => router.push(`/courses/${courseId}`)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Button> */}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enrolled Students</CardTitle>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No students enrolled in this course yet.</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No students match your search criteria.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.level}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {student.status}
                        </span>
                      </TableCell>
                      <TableCell>{student.grade || "N/A"}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/courses/${courseId}/students/${student.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}
