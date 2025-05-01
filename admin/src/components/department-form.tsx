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
import { fetchSchools } from "@/store/slices/schools-slice"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  schoolId: z.string({ required_error: "Please select a school" }),
})

interface DepartmentFormProps {
  initialData?: {
    id: string
    name: string
    description: string
    schoolId: string
  }
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
}

export function DepartmentForm({ initialData, onSubmit, isLoading }: DepartmentFormProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { schools, isLoading: isLoadingSchools } = useAppSelector((state) => state.schools)

  useEffect(() => {
    dispatch(fetchSchools())
  }, [dispatch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      schoolId: initialData?.schoolId || "",
    },
  })

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Department" : "Create Department"}</CardTitle>
        <CardDescription>
          {initialData ? "Update the department details below." : "Enter the details for the new department."}
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
                    <Input placeholder="e.g., Computer Science" {...field} />
                  </FormControl>
                  <FormDescription>The name of the department.</FormDescription>
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
                    <Textarea
                      placeholder="e.g., The Department of Computer Science focuses on..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description of the department.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schoolId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a school" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSchools ? (
                        <SelectItem value="loading" disabled>
                          Loading schools...
                        </SelectItem>
                      ) : schools.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No schools available
                        </SelectItem>
                      ) : (
                        schools.map((school) => (
                          <SelectItem key={school.id} value={school.id}>
                            {school.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>The school this department belongs to.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : initialData ? "Update Department" : "Create Department"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
