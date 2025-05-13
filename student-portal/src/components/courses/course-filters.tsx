"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  semesterId: z.string().optional(),
  programId: z.string().optional(),
  status: z.string().optional(),
})

type CourseFiltersProps = {
  semesters: Array<{ id: string; name: string }>
  programs: Array<{ id: string; name: string }>
}

export function CourseFilters({ semesters, programs }: CourseFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      semesterId: searchParams.get("semesterId") || "",
      programId: searchParams.get("programId") || "",
      status: searchParams.get("status") || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams()

    if (values.semesterId) params.set("semesterId", values.semesterId)
    if (values.programId) params.set("programId", values.programId)
    if (values.status) params.set("status", values.status)

    router.push(`?${params.toString()}`)
  }

  function resetFilters() {
    form.reset({
      semesterId: "",
      programId: "",
      status: "",
    })
    router.push("")
  }

  const hasActiveFilters =
    !!searchParams.get("semesterId") || !!searchParams.get("programId") || !!searchParams.get("status")

  return (
    <div className="mb-6 space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="semesterId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Semester</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Semesters" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          {semester.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="All Programs" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all">All Programs</SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
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
