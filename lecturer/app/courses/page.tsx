"use client"

import { useEffect, useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, Loader2, Users } from "lucide-react"
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
import { formatDateShort } from "@/lib/utils"
import Link from "next/link"

export default function CoursesPage() {
  const { lecturerProfile } = useAuth()
  const { getCourses, courses, isLoading, error } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      if (lecturerProfile?.id) {
        try {
          await getCourses(lecturerProfile.id)
        } catch (err) {
          console.error("Error fetching courses:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchCourses()
  }, [lecturerProfile, getCourses])

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isInitialLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PageContainer title="Courses" description="Manage your courses and teaching schedule">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Courses" description="Manage your courses and teaching schedule">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.courseCode}</TableCell>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell>{course.semesterName}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-2">
                          {course.studentCount}
                        </Badge>
                        {course.students && course.students.length > 0 && (
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/courses/${course.courseId}/students`}>
                              <Users className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDateShort(course.assignedDate)}</TableCell>
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
                            <Link href={`/courses/${course.courseId}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.courseId}/students`}>Manage Students</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.courseId}/materials`}>View Materials</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/courses/${course.courseId}/analytics`}>View Analytics</Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Archive Course</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No courses match your search" : "No courses found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </PageContainer>
  )
}
