"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Loader2, ArrowLeft } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses } from "@/lib/auth/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getInitials } from "@/lib/utils"

export default function CourseStudentsPage() {
  const { courseId } = useParams()
  const { lecturerProfile } = useAuth()
  const { getCourses, courses, isLoading, error } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [course, setCourse] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && courseId) {
        try {
          // Fetch courses if not already loaded
          if (courses.length === 0) {
            await getCourses(lecturerProfile.id)
          }

          // Find the current course
          const currentCourse = courses.find((c) => c.courseId === courseId)
          if (currentCourse) {
            setCourse(currentCourse)
            setStudents(currentCourse.students || [])
          }
        } catch (err) {
          console.error("Error fetching course data:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, courseId, courses, getCourses])

  const filteredStudents = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isInitialLoading || isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading students...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PageContainer title="Course Students" description="View and manage students in this course">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  if (!course) {
    return (
      <PageContainer title="Course Students" description="View and manage students in this course">
        <Alert variant="destructive">
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`${course.courseName} - Students`}
      description={`${course.courseCode} - ${course.semesterName}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/courses/${courseId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add Student</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.studentId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={student.fullName} />
                        <AvatarFallback>
                          {getInitials(student.fullName.split(" ")[0], student.fullName.split(" ")[1] || "")}
                        </AvatarFallback>
                      </Avatar>
                      {student.fullName}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/students/${student.id}`}>View Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Performance</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Attendance</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "No students match your search" : "No students enrolled in this course"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </PageContainer>
  )
}
