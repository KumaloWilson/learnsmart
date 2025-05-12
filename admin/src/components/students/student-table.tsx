"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useStudents } from "@/hooks/use-students"
import { usePrograms } from "@/hooks/use-programs"
import type { Student } from "@/types/student"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Eye, BookOpen, FileText } from "lucide-react"
import { format } from "date-fns"

export default function StudentTable() {
  const router = useRouter()
  const { toast } = useToast()
  const { students, loading, error, getStudents, deleteStudent } = useStudents()
  const { loadPrograms } = usePrograms()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])

  useEffect(() => {
    getStudents()
    loadPrograms()
  }, [getStudents, loadPrograms])

  useEffect(() => {
    if (students) {
      setFilteredStudents(
        students.filter(
          (student) =>
            student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.user?.firstName + " " + student.user?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.program?.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    }
  }, [students, searchTerm])

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id)
      toast({
        title: "Student deleted",
        description: "Student has been deleted successfully",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "graduated":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "suspended":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
          <CardDescription>Loading students...</CardDescription>
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
          <CardTitle>Students</CardTitle>
          <CardDescription>Manage student information and records</CardDescription>
        </div>
        <Button onClick={() => router.push("/students/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrollment Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>
                      {student.user?.firstName} {student.user?.lastName}
                    </TableCell>
                    <TableCell>{student.user?.email}</TableCell>
                    <TableCell>{student.program?.name}</TableCell>
                    <TableCell>{student.currentLevel}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(student.status)}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.enrollmentDate ? format(new Date(student.enrollmentDate), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => router.push(`/students/${student.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/students/edit/${student.id}`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/students/${student.id}/enrollments`)}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Enrollments
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/students/${student.id}/academic-records`)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Academic Records
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student.id)}>
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
