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
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  schoolId: z.string({ required_error: "Please select a school" }),
})

interface School {
  id: string
  name: string
}

interface DepartmentFormProps {
  department?: {
    id: string
    name: string
    description: string
    schoolId: string
  }
}

export function DepartmentForm({ department }: DepartmentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [schools, setSchools] = useState<School[]>([])
  const [isLoadingSchools, setIsLoadingSchools] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: department?.name || "",
      description: department?.description || "",
      schoolId: department?.schoolId || "",
    },
  })

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await fetchWithAuth("/schools")
        setSchools(data)
      } catch (error) {
        console.error("Failed to fetch schools:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load schools. Please try again.",
        })
      } finally {
        setIsLoadingSchools(false)
      }
    }

    fetchSchools()
  }, [toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      if (department) {
        // Update existing department
        await fetchWithAuth(`/departments/${department.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        })

        toast({
          title: "Department updated",
          description: "The department has been successfully updated.",
        })
      } else {
        // Create new department
        await fetchWithAuth("/departments", {
          method: "POST",
          body: JSON.stringify(values),
        })

        toast({
          title: "Department created",
          description: "The department has been successfully created.",
        })
      }

      router.push("/departments")
      router.refresh()
    } catch (error) {
      console.error("Failed to save department:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save department. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{department ? "Edit Department" : "Create Department"}</CardTitle>
        <CardDescription>
          {department ? "Update the department details below." : "Enter the details for the new department."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description of the department..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description of the department.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : department ? "Update Department" : "Create Department"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
