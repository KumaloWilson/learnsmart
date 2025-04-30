"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Download, Search, UserRound } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { authService, lecturerService } from "@/lib/api-services"


interface CourseStudentsProps {
  courseId: string
}

interface Student {
  id: string
  userId: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  profileImage?: string
  attendance: number
  assessmentCompletion: number
  averageGrade: number
  lastActive: string
  status: "active" | "at_risk" | "inactive"
}

export function CourseStudents({ courseId }: CourseStudentsProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true)
        const user = authService.getCurrentUser()
        if (!user) throw new Error("User not authenticated")

        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const studentsData = await lecturerService.getCourseStudents(courseId, lecturerProfile.id)
        setStudents(studentsData)
        setFilteredStudents(studentsData)
      } catch (err) {
        console.error("Failed to fetch students:", err)
        setError("Failed to load student data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [courseId])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = students.filter(
        (student) =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.studentId.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query),
      )
      setFilteredStudents(filtered)
    }
  }, [searchQuery, students])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const exportStudentData = () => {
    // Convert students data to CSV
    const headers = ["Student ID", "Name", "Email", "Attendance", "Assessment Completion", "Average Grade", "Status"]
    const csvData = [
      headers.join(","),
      ...filteredStudents.map(
        (student) =>
          `${student.studentId},"${student.firstName} ${student.lastName}",${student.email},${student.attendance}%,${
            student.assessmentCompletion
          }%,${student.averageGrade},${student.status}`,
      ),
    ].join("\n")

    // Create a blob and download
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `course-students-${courseId}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "at_risk":
        return <Badge variant="destructive">At Risk</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return <CourseStudentsSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Enrolled Students</CardTitle>
          <CardDescription>Students enrolled in this course</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={exportStudentData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center">
          <Search className="mr-2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name, ID, or email..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-sm"
          />
        </div>

        {filteredStudents.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <UserRound className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No students found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {students.length > 0
                ? "No students match your search criteria."
                : "There are no students enrolled in this course yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Assessment Completion</TableHead>
                  <TableHead>Average Grade</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center overflow-hidden">
                          {student.profileImage ? (
                            <img
                              src={student.profileImage || "/placeholder.svg"}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <UserRound className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        <span>
                          {student.firstName} {student.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.attendance}%</TableCell>
                    <TableCell>{student.assessmentCompletion}%</TableCell>
                    <TableCell>{student.averageGrade.toFixed(1)}</TableCell>
                    <TableCell>{new Date(student.lastActive).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(student.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CourseStudentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-4 h-10 w-[200px]" />
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
