"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchWithAuth } from "../lib/api-helpers"


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  schoolId: z.string({
    required_error: "Please select a school.",
  }),
})

interface School {
  id: string
  name: string
}

interface DepartmentFormProps {
  initialData?: any
  onSubmit: (data: z.infer<typeof formSchema>) => void
  isLoading: boolean
}

export function DepartmentForm({ initialData, onSubmit, isLoading }: DepartmentFormProps) {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoadingSchools, setIsLoadingSchools] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      schoolId: "",
    },
  })

  useEffect(() => {
    const loadSchools = async () => {
      setIsLoadingSchools(true)
      try {
        const data = await fetchWithAuth("/schools")
        setSchools(data)
      } catch (error) {
        console.error("Failed to load schools:", error)
      } finally {
        setIsLoadingSchools(false)
      }
    }

    loadSchools()
  }, [])

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Department name" {...field} />
              </FormControl>
              <FormDescription>The official name of the department.</FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingSchools}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
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
                <Textarea placeholder="Provide a description of the department" className="min-h-32" {...field} />
              </FormControl>
              <FormDescription>A detailed description of the department, its focus areas, and mission.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Update Department" : "Create Department"}
        </Button>
      </form>
    </Form>
  )
}
