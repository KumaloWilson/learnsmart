"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { removeCourseAssignment } from "@/store/slices/lecturers-slice"
import { useToast } from "@/components/ui/use-toast"
import { CourseAssignmentForm } from "./course-assignment-form"
import type { CourseAssignment } from "@/types/lecturer"

interface CourseAssignmentsTableProps {
  lecturerId: string
}

export function CourseAssignmentsTable({ lecturerId }: CourseAssignmentsTableProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { courseAssignments, loading } = useAppSelector((state) => state.lecturers)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<CourseAssignment | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this course assignment?")) {
      try {
        await dispatch(removeCourseAssignment(id)).unwrap()
        toast({
          title: "Success",
          description: "Course assignment removed successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove course assignment",
          variant: "destructive",
        })
      }
    }
  }

  const handleEdit = (assignment: CourseAssignment) => {
    setEditingAssignment(assignment)
    setShowAddForm(true)
  }

  const handleAddNew = () => {
    setEditingAssignment(null)
    setShowAddForm(true)
  }

  const handleFormClose = () => {
    setShowAddForm(false)
    setEditingAssignment(null)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "primary":
        return "bg-blue-100 text-blue-800"
      case "assistant":
        return "bg-purple-100 text-purple-800"
      case "guest":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <>
      {showAddForm ? (
        <CourseAssignmentForm lecturerId={lecturerId} assignment={editingAssignment} onClose={handleFormClose} />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Course Assignments</CardTitle>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Course
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Enrollment Count</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : courseAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No course assignments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    courseAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{assignment.course?.title}</p>
                            <p className="text-sm text-gray-500">{assignment.course?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>{assignment.semester?.name}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(assignment.role)}>{assignment.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={assignment.isActive ? "default" : "outline"}>
                            {assignment.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{assignment.enrollmentCount || 0} students</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(assignment)}>Edit</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(assignment.id)}>Remove</DropdownMenuItem>
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
      )}
    </>
  )
}
