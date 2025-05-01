"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchDepartments } from "@/store/slices/departments-slice"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  level: z.string({ required_error: "Please select a level" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 year" })
    .max(10, { message: "Duration cannot exceed 10 years" }),
  departmentId: z.string({ required_error: "Please select a department" }),
})

interface ProgramFormProps {
  initialData?: {
    id: string
    name: string
    code: string
    level: string
    duration: number
    departmentId: string
  }
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
}

export function ProgramForm({ initialData, onSubmit, isLoading }: ProgramFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { departments, isLoading: isLoadingDepartments } = useAppSelector((state) => state.departments)

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      level: initialData?.level || "",
      duration: initialData?.duration || 4,
      departmentId: initialData?.departmentId || "",
    },
  })

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Program" : "Create Program"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the program details below." : "Enter the details for the new program."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bachelor of Computer Science" {...field} />
                  </FormControl>
                  <FormDescription>The full name of the program.</FormDescription>
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
                    <Input placeholder="e.g., BCS" {...field} />
                  </FormControl>
                  <FormDescription>A short code or abbreviation for the program.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Graduate">Graduate</SelectItem>
                        <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="Doctorate">Doctorate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The academic level of the program.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} max={10} {...field} />
                    </FormControl>
                    <FormDescription>The standard duration of the program in years.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingDepartments ? (
                        <SelectItem value="loading" disabled>
                          Loading departments...
                        </SelectItem>
                      ) : departments.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No departments available
                        </SelectItem>
                      ) : (
                        departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>The department this program belongs to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : initialData ? "Update Program" : "Create Program"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
