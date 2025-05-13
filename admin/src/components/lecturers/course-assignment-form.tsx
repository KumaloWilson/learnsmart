"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLecturers } from "@/hooks/use-lecturers"
import { useCourses } from "@/hooks/use-courses"
import { useSemesters } from "@/hooks/use-semesters"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { CourseAssignment, CreateCourseAssignmentDto, UpdateCourseAssignmentDto } from "@/types/lecturer"
import { ASSIGNMENT_ROLES } from "@/types/lecturer"

interface CourseAssignmentFormProps {
  lecturerId: string
  assignment?: CourseAssignment
  isEdit?: boolean
}

export function CourseAssignmentForm({ lecturerId, assignment, isEdit = false }: CourseAssignmentFormProps) {
  const router = useRouter()
  const { addCourseAssignment, editCourseAssignment, error, isLoading } = useLecturers()
  const { courses, loadCourses } = useCourses()
  const { semesters, loadSemesters } = useSemesters()

  const [formData, setFormData] = useState<CreateCourseAssignmentDto | UpdateCourseAssignmentDto>({
    lecturerProfileId: lecturerId,
    courseId: "",
    semesterId: "",
    role: "primary",
    isActive: true,
  })

  useEffect(() => {
    loadCourses()
    loadSemesters()

    if (isEdit && assignment) {
      setFormData({
        role: assignment.role,
        isActive: assignment.isActive,
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        lecturerProfileId: lecturerId,
      }))
    }
  }, [isEdit, assignment, lecturerId, loadCourses, loadSemesters])

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEdit && assignment) {
        await editCourseAssignment(assignment.id, formData as UpdateCourseAssignmentDto)
        router.push(`/lecturers/${lecturerId}/courses`)
      } else {
        await addCourseAssignment(formData as CreateCourseAssignmentDto)
        router.push(`/lecturers/${lecturerId}/courses`)
      }
    } catch (err) {
      console.error("Error saving course assignment:", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Course Assignment" : "Assign Course"}</CardTitle>
        <CardDescription>
          {isEdit ? "Update course assignment details" : "Assign a course to this lecturer"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isEdit && (
            <>
              <div className="space-y-2">
                <Label htmlFor="course">Course</Label>
                <Select
                  name="courseId"
                  value={(formData as CreateCourseAssignmentDto).courseId || ""}
                  onValueChange={(value) => handleSelectChange("courseId", value)}
                  required={!isEdit}
                  disabled={isEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  name="semesterId"
                  value={(formData as CreateCourseAssignmentDto).semesterId || ""}
                  onValueChange={(value) => handleSelectChange("semesterId", value)}
                  required={!isEdit}
                  disabled={isEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name} ({semester.isActive ? "Active" : "Inactive"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={formData.role || "primary"}
              onValueChange={(value) => handleSelectChange("role", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNMENT_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive !== undefined ? formData.isActive : true}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isActive">Active Assignment</Label>
          </div>

          {isEdit && assignment && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Course</h3>
                  <p className="text-sm text-muted-foreground">
                    {assignment.course?.name} ({assignment.course?.code})
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Semester</h3>
                  <p className="text-sm text-muted-foreground">{assignment.semester?.name}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading.createAssignment || isLoading.updateAssignment}>
            {isLoading.createAssignment || isLoading.updateAssignment
              ? isEdit
                ? "Updating..."
                : "Assigning..."
              : isEdit
                ? "Update Assignment"
                : "Assign Course"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
