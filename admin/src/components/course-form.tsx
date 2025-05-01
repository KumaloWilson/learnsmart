"use client"

import { useEffect } from "react"
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
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchPrograms } from "@/store/slices/programs-slice"

const formSchema = z.object({
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  credits: z.coerce
    .number()
    .min(1, { message: "Credits must be at least 1" })
    .max(20, { message: "Credits cannot exceed 20" }),
  programId: z.string({ required_error: "Please select a program" }),
  level: z.string({ required_error: "Please select a level" }),
})

interface CourseFormProps {
  initialData?: {
    id: string
    code: string
    name: string
    description: string
    credits: number
    programId: string
    level: string
  }
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
}

export function CourseForm({ initialData, onSubmit, isLoading }: CourseFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { programs, isLoading: isLoadingPrograms } = useAppSelector((state) => state.programs)

  useEffect(() => {
    dispatch(fetchPrograms())
  }, [dispatch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      credits: initialData?.credits || 3,
      programId: initialData?.programId || "",
      level: initialData?.level || "",
    },
  })

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Course" : "Create Course"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the course details below." : "Enter the details for the new course."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CS101" {...field} />
                    </FormControl>
                    <FormDescription>A unique code for the course.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to Computer Science" {...field} />
                    </FormControl>
                    <FormDescription>The full name of the course.</FormDescription>
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
                    <Textarea
                      placeholder="e.g., This course introduces the fundamentals of..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A detailed description of the course content and objectives.</FormDescription>
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
                      <Input type="number" min={1} max={20} {...field} />
                    </FormControl>
                    <FormDescription>The number of credit hours for this course.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Introductory">Introductory</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The academic level of the course.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                            {program.name}
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

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : initialData ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
