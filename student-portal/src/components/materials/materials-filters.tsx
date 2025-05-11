"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Search, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  courseId: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
})

type MaterialsFiltersProps = {
  courses: Array<{ id: string; name: string }>
}

export function MaterialsFilters({ courses }: MaterialsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: searchParams.get("courseId") || "",
      type: searchParams.get("type") || "",
      search: searchParams.get("search") || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()

    if (values.courseId) params.set("courseId", values.courseId)
    if (values.type) params.set("type", values.type)
    if (values.search) params.set("search", values.search)

    router.push(`?${params.toString()}`)
  }

  function resetFilters() {
    form.reset({
      courseId: "",
      type: "",
      search: "",
    })
    router.push("")
  }

  const hasActiveFilters = !!searchParams.get("courseId") || !!searchParams.get("type") || !!searchParams.get("search")

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
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search</FormLabel>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Search materials..." className="pl-8" {...field} />
                    </FormControl>
                  </div>
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
