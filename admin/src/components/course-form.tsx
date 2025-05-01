"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchWithAuth } from "@/lib/api-helpers"
import { useToast } from "./ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  credits: z.coerce
    .number()
    .min(1, { message: "Credits must be at least 1" })
    .max(12, { message: "Credits cannot exceed 12" }),
  programId: z.string({ required_error: "Please select a program" }),
})

interface Program {
  id: string
  name: string
  departmentName?: string
}

interface CourseFormProps {
  course?: {
    id: string
    name: string
    code: string
    description: string
    credits: number
    programId: string
  }
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: course?.name || "",
      code: course?.code || "",
      description: course?.description || "",
      credits: course?.credits || 3,
      programId: course?.programId || "",
    },
  })

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await fetchWithAuth("/programs")
        setPrograms(data)
      } catch (error) {
        console.error("Failed to fetch programs:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load programs. Please try again.",
        })
      } finally {
        setIsLoadingPrograms(false)
      }
    }

    fetchPrograms()
  }, [toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      if (course) {
        // Update existing course
        await fetchWithAuth(`/courses/${course.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        })

        toast({
          title: "Course updated",
          description: "The course has been successfully updated.",
        })
      } else {
        // Create new course
        await fetchWithAuth("/courses", {
          method: "POST",
          body: JSON.stringify(values),
        })

        toast({
          title: "Course created",
          description: "The course has been successfully created.",
        })
      }

      router.push("/courses")
      router.refresh()
    } catch (error) {
      console.error("Failed to save course:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save course. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course ? "Edit Course" : "Create Course"}</CardTitle>
        <CardDescription>
          {course ? "Update the course details below." : "Enter the details for the new course."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to Programming" {...field} />
                    </FormControl>
                    <FormDescription>The full name of the course.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CS101" {...field} />
                    </FormControl>
                    <FormDescription>The course code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a description of the course..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of the course content and objectives.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={12} {...field} />
                    </FormControl>
                    <FormDescription>The number of credit hours for this course.</FormDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a program" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingPrograms ? (
                          <SelectItem value="loading" disabled>
                            Loading programs...
                          </SelectItem>
                        ) : programs.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No programs available
                          </SelectItem>
                        ) : (
                          programs.map((program) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.name} {program.departmentName ? `(${program.departmentName})` : ""}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>The program this course belongs to.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : course ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
