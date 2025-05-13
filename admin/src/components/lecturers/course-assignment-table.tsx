"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useLecturers } from "@/hooks/use-lecturers"
import { Badge } from "@/components/ui/badge"

interface CourseAssignmentTableProps {
  lecturerId: string
}

export function CourseAssignmentTable({ lecturerId }: CourseAssignmentTableProps) {
  const router = useRouter()
  const { courseAssignments, loadCourseAssignments, removeCourseAssignment, isLoading } = useLecturers()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadCourseAssignments(lecturerId)
  }, [lecturerId, loadCourseAssignments])

  const handleViewCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handleViewSemester = (semesterId: string) => {
    router.push(`/semesters/${semesterId}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/lecturers/${lecturerId}/courses/edit/${id}`)
  }

  const handleDelete = async () => {
    if (deleteId) {
      await removeCourseAssignment(deleteId)
      setDeleteId(null)
    }
  }

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  if (isLoading.courseAssignments) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-full p-4 border rounded-md">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseAssignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  No course assignments found. Assign this lecturer to courses.
                </TableCell>
              </TableRow>
            ) : (
              courseAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.course?.name}</TableCell>
                  <TableCell>{assignment.course?.code}</TableCell>
                  <TableCell>{assignment.semester?.name}</TableCell>
                  <TableCell className="capitalize">{formatRole(assignment.role)}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.isActive ? "default" : "secondary"}>
                      {assignment.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewCourse(assignment.courseId)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Course
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewSemester(assignment.semesterId)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Semester
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(assignment.id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Assignment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteId(assignment.id)}
                        >
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this course assignment from the lecturer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
