"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useStudents } from "@/hooks/use-students"
import { useSemesters } from "@/hooks/use-semesters"
import type { Enrollment } from "@/types/student"
import { Search, Plus, MoreHorizontal, Edit, Trash2, ArrowLeft } from "lucide-react"

interface EnrollmentTableProps {
  studentId: string
}

export default function EnrollmentTable({ studentId }: EnrollmentTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { enrollments, loading, error, getStudentEnrollments, getStudentEnrollmentsBySemester, deleteEnrollment } =
    useStudents()
  const { semesters, getSemesters } = useSemesters()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSemester, setSelectedSemester] = useState<string>("")
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([])

  useEffect(() => {
    getStudentEnrollments(studentId)
    getSemesters()
  }, [studentId, getStudentEnrollments, getSemesters])

  useEffect(() => {
    if (enrollments) {
      setFilteredEnrollments(
        enrollments.filter(
          (enrollment) =>
            enrollment.course?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enrollment.course?.code.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [enrollments, searchTerm])

  const handleSemesterChange = async (semesterId: string) => {
    setSelectedSemester(semesterId)
    if (semesterId) {
      await getStudentEnrollmentsBySemester(studentId, semesterId)
    } else {
      await getStudentEnrollments(studentId)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteEnrollment(id)
      toast({
        title: "Enrollment deleted",
        description: "Enrollment has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete enrollment",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "enrolled":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "withdrawn":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Enrollments</CardTitle>
          <CardDescription>Loading enrollments...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Student Enrollments</CardTitle>
          <CardDescription>Manage course enrollments for this student</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/students/${studentId}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Student
          </Button>
          <Button onClick={() => router.push(`/students/${studentId}/enrollments/create`)}>
            <Plus className="mr-2 h-4 w-4" />
            Enroll in Course
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={selectedSemester} onValueChange={handleSemesterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Letter Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No enrollments found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="font-medium">{enrollment.course?.code}</TableCell>
                    <TableCell>{enrollment.course?.name}</TableCell>
                    <TableCell>{enrollment.semester?.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(enrollment.status)}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{enrollment.grade !== null ? enrollment.grade : "N/A"}</TableCell>
                    <TableCell>{enrollment.letterGrade || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/students/${studentId}/enrollments/edit/${enrollment.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(enrollment.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
