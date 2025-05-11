"use client"

import { useState } from "react"
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
  startDate: z.date().optional(),
  endDate: z.date().optional(),
})

type AttendanceFiltersProps = {
  courses: Array<{ id: string; name: string }>
  onFilterChange: (filters: { courseId?: string; startDate?: Date; endDate?: Date }) => void
}

export function AttendanceFilters({ courses, onFilterChange }: AttendanceFiltersProps) {
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      startDate: undefined,
      endDate: undefined,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onFilterChange({
      courseId: values.courseId !== "all" ? values.courseId : undefined,
      startDate: values.startDate,
      endDate: values.endDate,
    })
  }

  function resetFilters() {
    form.reset({
      courseId: "",
      startDate: undefined,
      endDate: undefined,
    })
    onFilterChange({})
  }

  const hasActiveFilters = form.watch("courseId") || form.watch("startDate") || form.watch("endDate")

  return (
    <div className="mb-6 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
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
                          setStartDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
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
                          setEndDateOpen(false)
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
