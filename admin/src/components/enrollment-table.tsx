"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "@/store"
import { updateEnrollment, withdrawFromCourse } from "@/store/slices/students-slice"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { CourseEnrollment } from "@/lib/api/students-api"
import { EnrollmentForm } from "./enrollment-form"

interface EnrollmentTableProps {
  studentId: string
  enrollments: CourseEnrollment[]
}

export function EnrollmentTable({ studentId, enrollments }: EnrollmentTableProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<CourseEnrollment | null>(null)
  const [gradeInput, setGradeInput] = useState<number | undefined>(undefined)
  const [statusInput, setStatusInput] = useState<string>("")

  const handleEditClick = (enrollment: CourseEnrollment) => {
    setSelectedEnrollment(enrollment)
    setGradeInput(enrollment.grade)
    setStatusInput(enrollment.status)
    setIsEditDialogOpen(true)
  }

  const handleUpdateEnrollment = async () => {
    if (!selectedEnrollment) return

    try {
      await dispatch(
        updateEnrollment({
          id: selectedEnrollment.id,
          data: {
            grade: gradeInput,
            status: statusInput as any,
          },
        }),
      ).unwrap()

      toast({
        title: "Success",
        description: "Enrollment updated successfully",
      })

      setIsEditDialogOpen(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update enrollment",
        variant: "destructive",
      })
    }
  }

  const handleWithdraw = async (enrollmentId: string) => {
    if (confirm("Are you sure you want to withdraw this student from this course?")) {
      try {
        await dispatch(withdrawFromCourse(enrollmentId)).unwrap()
        toast({
          title: "Success",
          description: "Student withdrawn from course successfully",
        })
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to withdraw student from course",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "enrolled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Enrollments</CardTitle>
          <CardDescription>Manage student course enrollments</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Enroll in Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Enroll in Course</DialogTitle>
              <DialogDescription>Enroll this student in a course for a specific semester.</DialogDescription>
            </DialogHeader>
            <EnrollmentForm studentId={studentId} onSuccess={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No enrollments found
                  </TableCell>
                </TableRow>
              ) : (
                enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{enrollment.course?.name}</p>
                        <p className="text-sm text-gray-500">{enrollment.course?.code}</p>
                      </div>
                    </TableCell>
                    <TableCell>{enrollment.semester?.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(enrollment.status)}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {enrollment.grade ? (
                        <div>
                          <span className="font-medium">{enrollment.grade}%</span>
                          {enrollment.letterGrade && (
                            <span className="ml-2 text-sm text-gray-500">({enrollment.letterGrade})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
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
                          <DropdownMenuItem onClick={() => handleEditClick(enrollment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Update Grade/Status
                          </DropdownMenuItem>
                          {enrollment.status !== "withdrawn" && (
                            <DropdownMenuItem onClick={() => handleWithdraw(enrollment.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Withdraw
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Enrollment</DialogTitle>
              <DialogDescription>Update the grade and status for this course enrollment.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade (0-100)</Label>
                <Input
                  id="grade"
                  type="number"
                  min={0}
                  max={100}
                  value={gradeInput || ""}
                  onChange={(e) => setGradeInput(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusInput} onValueChange={setStatusInput}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enrolled">Enrolled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateEnrollment}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
