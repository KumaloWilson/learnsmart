"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useStudents } from "@/hooks/use-students"
import { useCourses } from "@/hooks/use-courses"
import { useSemesters } from "@/hooks/use-semesters"
import type { EnrollmentFormData } from "@/types/student"
import { ArrowLeft } from "lucide-react"

const formSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  semesterId: z.string().min(1, "Semester is required"),
  status: z.enum(["enrolled", "completed", "failed", "withdrawn"]).default("enrolled"),
  grade: z.coerce.number().min(0).max(100).optional(),
})

interface EnrollmentFormProps {
  studentId: string
  enrollmentId?: string
}

export default function EnrollmentForm({ studentId, enrollmentId }: EnrollmentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { enrollments, getStudentEnrollments, createEnrollment, updateEnrollment } = useStudents()
  const { courses, loadCourses } = useCourses()
  const { semesters, loadSemesters } = useSemesters()
  const [isSubmitting, setIsSubmitting] = useState(false)

  type FormData = z.infer<typeof formSchema>
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      semesterId: "",
      status: "enrolled",
      grade: undefined,
    },
  })

  useEffect(() => {
    loadCourses()
    loadSemesters()

    if (studentId) {
      getStudentEnrollments(studentId)
    }
  }, [studentId, loadCourses, loadSemesters, getStudentEnrollments])

  useEffect(() => {
    if (enrollmentId && enrollments.length > 0) {
      const enrollment = enrollments.find((e) => e.id === enrollmentId)
      if (enrollment) {
        form.reset({
          courseId: enrollment.courseId,
          semesterId: enrollment.semesterId,
          status: enrollment.status,
          grade: enrollment.grade || undefined,
        })
      }
    }
  }, [enrollmentId, enrollments, form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      const enrollmentData: EnrollmentFormData = {
        studentProfileId: studentId,
        courseId: data.courseId,
        semesterId: data.semesterId,
        status: data.status,
        grade: data.grade,
      }

      if (enrollmentId) {
        await updateEnrollment(enrollmentId, enrollmentData)
        toast({
          title: "Enrollment updated",
          description: "Enrollment has been updated successfully",
        })
      } else {
        await createEnrollment(enrollmentData)
        toast({
          title: "Enrollment created",
          description: "Student has been enrolled in the course successfully",
        })
      }

      router.push(`/students/${studentId}/enrollments`)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to save enrollment information",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{enrollmentId ? "Edit Enrollment" : "Enroll in Course"}</CardTitle>
        <CardDescription>
          {enrollmentId ? "Update enrollment information" : "Enroll student in a course"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!enrollmentId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.code} - {course.name}
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!!enrollmentId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade (0-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter grade"
                      {...field}
                      value={field.value === undefined ? "" : field.value}
                    />
                  </FormControl>
                  <FormDescription>Leave blank if grade is not available yet</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/students/${studentId}/enrollments`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : enrollmentId ? "Update Enrollment" : "Enroll Student"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
