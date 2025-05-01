"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchWithAuth } from "@/lib/api-helpers"
import { useToast } from "./ui/use-toast"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  description: z.string().optional(),
})

interface SchoolFormProps {
  school?: {
    id: string
    name: string
    code: string
    description?: string
  }
}

export function SchoolForm({ school }: SchoolFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: school?.name || "",
      code: school?.code || "",
      description: school?.description || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      if (school) {
        // Update existing school
        await fetchWithAuth(`/schools/${school.id}`, {
          method: "PUT",
          body: JSON.stringify(values),
        })

        toast({
          title: "School updated",
          description: "The school has been successfully updated.",
        })
      } else {
        // Create new school
        await fetchWithAuth("/schools", {
          method: "POST",
          body: JSON.stringify(values),
        })

        toast({
          title: "School created",
          description: "The school has been successfully created.",
        })
      }

      router.push("/schools")
      router.refresh()
    } catch (error) {
      console.error("Failed to save school:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save school. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{school ? "Edit School" : "Create School"}</CardTitle>
        <CardDescription>
          {school ? "Update the school details below." : "Enter the details for the new school."}
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
                    <Input placeholder="e.g., School of Engineering" {...field} />
                  </FormControl>
                  <FormDescription>The full name of the school.</FormDescription>
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
                    <Input placeholder="e.g., ENG" {...field} />
                  </FormControl>
                  <FormDescription>A short code or abbreviation for the school.</FormDescription>
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
                    <Textarea placeholder="Enter a description of the school..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of the school (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : school ? "Update School" : "Create School"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
