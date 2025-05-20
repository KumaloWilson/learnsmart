"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, Filter, Download, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PageSection } from "@/components/page-container"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses } from "@/lib/auth/hooks"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentsPage() {
  const router = useRouter()
  const { lecturerProfile } = useAuth()
  const lecturerId = lecturerProfile?.id || ""
  const { getCourses, courses, isLoading, error } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [allStudents, setAllStudents] = useState<any[]>([])
  
console.log(allStudents)
  useEffect(() => {
    if (lecturerId) {
      getCourses(lecturerId)
    }
  }, [lecturerId, getCourses])

  useEffect(() => {
    // Collect all students from all courses
    if (courses && courses.length > 0) {
      const students: any[] = []
      courses.forEach((course) => {
        if (course.students) {
          course.students.forEach((student) => {
            // Add course info to each student
            students.push({
              ...student,
              courseName: course.courseName,
              courseCode: course.courseCode,
              courseId: course.courseId,
            })
          })
        }
      })
      setAllStudents(students)

      // If no course is selected, show all students
      if (!selectedCourseId) {
        setFilteredStudents(students)
      }
    }
  }, [courses])

  useEffect(() => {
    // Filter students based on selected course and search term
    let filtered = [...allStudents]

    if (selectedCourseId) {
      filtered = filtered.filter((student) => student.courseId === selectedCourseId)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(term) ||
          student.studentId.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term),
      )
    }

    setFilteredStudents(filtered)
  }, [selectedCourseId, searchTerm, allStudents])

  const getPerformanceBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800">
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800">
            Inactive
          </Badge>
        )
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800">
            {status}
          </Badge>
        )
    }
  }

  const actions = (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button variant="outline" size="sm" className="gap-1">
        <Filter className="h-4 w-4" /> Filter
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        <Download className="h-4 w-4" /> Export
      </Button>
      <Button size="sm" className="gap-1">
        <Plus className="h-4 w-4" /> Add Student
      </Button>
    </div>
  )

  if (isLoading) {
    return (
      <PageContainer title="Students" description="Loading student data...">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer title="Students" description="Error loading student data">
        <div className="p-4 text-center">
          <p className="text-red-500">Failed to load student data. Please try again later.</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Students" description="View and manage your students across all courses" actions={actions}>
      <PageSection title="Student Directory" description="Browse and manage all students">
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students by name, ID or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.courseCode}: {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground">No students found matching your criteria.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden data-table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-muted">
                          <AvatarImage src={`/placeholder-32px.png?height=32&width=32`} alt={student.fullName} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {student.fullName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.fullName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-muted/50">
                        {student.courseCode}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPerformanceBadge(student.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/students/${student.id}`)}>
                            <span className="flex items-center w-full">View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/courses/${student.courseId}/students/${student.id}`)}
                          >
                            <span className="flex items-center w-full">View Performance</span>
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem>
                            <span className="flex items-center w-full">Send Message</span>
                          </DropdownMenuItem> */}
                          <DropdownMenuItem  onClick={() => router.push(`/attendance/${student.id}`)}>
                            <span className="flex items-center w-full">View Attendance</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </PageSection>
    </PageContainer>
  )
}
