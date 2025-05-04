"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/store"
import { assignCourseToLecturer, updateCourseAssignment } from "@/store/slices/lecturers-slice"
import { fetchCourses } from "@/store/slices/courses-slice"
import { fetchSemesters } from "@/store/slices/semesters-slice"
import { useToast } from "@/components/ui/use-toast"
import type { CourseAssignment } from "@/types/lecturer"

const formSchema = z.object({
  courseId: z.string().uuid("Please select a course"),
  semesterId: z.string().uuid("Please select a semester"),
  role: z.enum(["primary", "assistant", "guest"]),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface CourseAssignmentFormProps {
  lecturerId: string
  assignment?: CourseAssignment | null
  onClose: () => void
}

export function CourseAssignmentForm({ lecturerId, assignment, onClose }: CourseAssignmentFormProps) {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { courses } = useAppSelector((state) => state.courses)
  const { semesters } = useAppSelector((state) => state.semesters)
  const { loading } = useAppSelector((state) => state.lecturers)

  useEffect(() => {
    dispatch(fetchCourses())
    dispatch(fetchSemesters())
  }, [dispatch])

  const defaultValues: Partial<FormValues> = {
    courseId: assignment?.courseId || "",
    semesterId: assignment?.semesterId || "",
    role: assignment?.role || "primary",
    isActive: assignment?.isActive ?? true,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const onSubmit = async (data: FormValues) => {
    try {
      if (assignment) {
        await dispatch(
          updateCourseAssignment({
            id: assignment.id,
            assignmentData: {
              ...data,
              lecturerProfileId: lecturerId,
            },
          }),
        ).unwrap()
        toast({
          title: "Success",
          description: "Course assignment updated successfully",
        })
      } else {
        await dispatch(
          assignCourseToLecturer({
            ...data,
            lecturerProfileId: lecturerId,
          }),
        ).unwrap()
        toast({
          title: "Success",
          description: "Course assigned successfully",
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: assignment ? "Failed to update course assignment" : "Failed to assign course",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignment ? "Edit Course Assignment" : "Assign New Course"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.code} - {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="semesterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester.id} value={semester.id}>
                            {semester.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : assignment ? "Update Assignment" : "Assign Course"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
