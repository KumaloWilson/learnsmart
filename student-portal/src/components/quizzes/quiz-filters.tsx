"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { getEnrolledCourses } from "@/lib/api/courses-api"

const formSchema = z.object({
  courseId: z.string().optional(),
  status: z.string().optional(),
})

export function QuizFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    async function fetchCourses() {
      try {
        const coursesData = await getEnrolledCourses()
        setCourses(
          coursesData.map((course) => ({
            id: course.id,
            name: course.name,
          })),
        )
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      }
    }

    fetchCourses()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: searchParams.get("courseId") || "",
      status: searchParams.get("status") || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()

    if (values.courseId && values.courseId !== "all") params.set("courseId", values.courseId)
    if (values.status && values.status !== "all") params.set("status", values.status)

    router.push(`?${params.toString()}`)
  }

  function resetFilters() {
    form.reset({
      courseId: "",
      status: "",
    })
    router.push("")
  }

  const hasActiveFilters = !!searchParams.get("courseId") || !!searchParams.get("status")

  return (
    <div className="mb-6 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <SelectValue placeholder="All Courses" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button type="submit">Apply Filters</Button>
            {hasActiveFilters && (
              <Button type="button" variant="outline" onClick={resetFilters} className="flex items-center space-x-1">
                <X className="h-4 w-4" />
                <span>Reset</span>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
