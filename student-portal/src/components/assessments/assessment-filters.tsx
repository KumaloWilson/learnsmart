"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  courseId: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  dueDate: z.date().optional(),
})

type AssessmentFiltersProps = {
  courses: Array<{ id: string; name: string }>
}

export function AssessmentFilters({ courses }: AssessmentFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: searchParams.get("courseId") || "",
      status: searchParams.get("status") || "",
      type: searchParams.get("type") || "",
      dueDate: searchParams.get("dueDate") ? new Date(searchParams.get("dueDate") as string) : undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()

    if (values.courseId) params.set("courseId", values.courseId)
    if (values.status) params.set("status", values.status)
    if (values.type) params.set("type", values.type)
    if (values.dueDate) params.set("dueDate", format(values.dueDate, "yyyy-MM-dd"))

    router.push(`?${params.toString()}`)
  }

  function resetFilters() {
    form.reset({
      courseId: "",
      status: "",
      type: "",
      dueDate: undefined,
    })
    router.push("")
  }

  const hasActiveFilters =
    !!searchParams.get("courseId") ||
    !!searchParams.get("status") ||
    !!searchParams.get("type") ||
    !!searchParams.get("dueDate")

  return (
    <div className="mb-6 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setIsOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
