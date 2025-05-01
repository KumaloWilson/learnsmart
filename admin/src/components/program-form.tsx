"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchWithAuth } from "@/lib/api-helpers"
import { useToast } from "./ui/use-toast"

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

interface Department {
  id: string
  name: string
}

interface ProgramFormProps {
  program?: {
    id: string
    name: string
    code: string
    level: string
    duration: number
    departmentId: string
  }
}

export function ProgramForm({ program }: ProgramFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: program?.name || "",
      code: program?.code || "",
      level: program?.level || "",
      duration: program?.duration || 4,
      departmentId: program?.departmentId || "",
    },
  })

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await fetchWithAuth("/departments")
        setDepartments(data)
      } catch (error) {
        console.error("Failed to fetch departments:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load departments. Please try again.",
        })
      } finally {
        setIsLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      if (program) {
        // Update existing program
        await fetchWithAuth(`/programs/${program.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        })

        toast({
          title: "Program updated",
          description: "The program has been successfully updated.",
        })
      } else {
        // Create new program
        await fetchWithAuth("/programs", {
          method: "POST",
          body: JSON.stringify(values),
        })

        toast({
          title: "Program created",
          description: "The program has been successfully created.",
        })
      }

      router.push("/programs")
      router.refresh()
    } catch (error) {
      console.error("Failed to save program:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save program. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{program ? "Edit Program" : "Create Program"}</CardTitle>
        <CardDescription>
          {program ? "Update the program details below." : "Enter the details for the new program."}
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
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : program ? "Update Program" : "Create Program"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
