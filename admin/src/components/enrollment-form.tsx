"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { enrollStudentInCourse } from "@/store/slices/students-slice"
import { fetchCourses } from "@/store/slices/courses-slice"
import { fetchSemesters } from "@/store/slices/semesters-slice"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface EnrollmentFormProps {
  studentId: string
  onSuccess?: () => void
}

export function EnrollmentForm({ studentId, onSuccess }: EnrollmentFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const { courses } = useSelector((state: RootState) => state.courses)
  const { semesters } = useSelector((state: RootState) => state.semesters)
  const { isLoading } = useSelector((state: RootState) => state.students)

  const [courseId, setCourseId] = useState("")
  const [semesterId, setSemesterId] = useState("")

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchSemesters())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!courseId || !semesterId) {
      toast({
        title: "Error",
        description: "Please select both a course and semester",
        variant: "destructive",
      })
      return
    }

    try {
      await dispatch(
        enrollStudentInCourse({
          studentProfileId: studentId,
          courseId,
          semesterId,
        }),
      ).unwrap()

      toast({
        title: "Success",
        description: "Student enrolled in course successfully",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll student in course",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="courseId">Course</Label>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger id="courseId">
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
        <Label htmlFor="semesterId">Semester</Label>
        <Select value={semesterId} onValueChange={setSemesterId}>
          <SelectTrigger id="semesterId">
            <SelectValue placeholder="Select a semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enroll Student
        </Button>
      </div>
    </form>
  )
}
