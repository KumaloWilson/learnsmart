"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { fetchWithAuth } from "../lib/api-helpers"

const courseFormSchema = z.object({
  code: z.string().min(2, "Course code must be at least 2 characters"),
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  credits: z.coerce.number().min(1, "Credits must be at least 1").max(20, "Credits cannot exceed 20"),
  programId: z.string().min(1, "Program is required"),
})

type CourseFormValues = z.infer<typeof courseFormSchema>

interface Program {
  id: string
  name: string
  departmentId: string
  departmentName?: string
}

interface CourseFormProps {
  initialData?: CourseFormValues
  onSubmit: (data: CourseFormValues) => void
  isSubmitting: boolean
}

export function CourseForm({ initialData, onSubmit, isSubmitting }: CourseFormProps) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true)

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      description: "",
      credits: 3,
      programId: "",
    },
  })

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetchWithAuth("/api/programs")
        if (!response.ok) {
          throw new Error("Failed to fetch programs")
        }
        const data = await response.json()

        // Fetch department details for each program
        const programsWithDepartments = await Promise.all(
          data.map(async (program: Program) => {
            const deptResponse = await fetchWithAuth(`/api/departments/${program.departmentId}`)
            if (deptResponse.ok) {
              const deptData = await deptResponse.json()
              return { ...program, departmentName: deptData.name }
            }
            return program
          }),
        )

        setPrograms(programsWithDepartments)
      } catch (error) {
        console.error("Error fetching programs:", error)
      } finally {
        setIsLoadingPrograms(false)
      }
    }

    fetchPrograms()
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Code</FormLabel>
                <FormControl>
                  <Input placeholder="CS101" {...field} />
                </FormControl>
                <FormDescription>The unique identifier for this course</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="credits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credits</FormLabel>
                <FormControl>
                  <Input type="number" min={1} max={20} {...field} />
                </FormControl>
                <FormDescription>Number of credit hours for this course</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Name</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Computer Science" {...field} />
              </FormControl>
              <FormDescription>The full name of the course</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter course description..." className="min-h-[120px]" {...field} />
              </FormControl>
              <FormDescription>Detailed description of the course content and objectives</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="programId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Program</FormLabel>
              <Select disabled={isLoadingPrograms} onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingPrograms ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading programs...</span>
                    </div>
                  ) : (
                    programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.name} {program.departmentName ? `(${program.departmentName})` : ""}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormDescription>The academic program this course belongs to</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Course" : "Create Course"}
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
