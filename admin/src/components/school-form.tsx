"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { fetchWithAuth } from "../lib/api-helpers"
import { useToast } from "./ui/use-toast"


const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "School name must be at least 2 characters.",
    })
    .max(100, {
      message: "School name must not exceed 100 characters.",
    }),
  code: z
    .string()
    .max(20, {
      message: "Code must not exceed 20 characters.",
    })
    .optional(),
  description: z
    .string()
    .max(500, {
      message: "Description must not exceed 500 characters.",
    })
    .optional(),
})

interface SchoolFormProps {
  school?: {
    id: string
    name: string
    code?: string
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
          description: "The new school has been successfully created.",
        })
      }

      router.push("/schools")
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="School of Engineering" {...field} />
                  </FormControl>
                  <FormDescription>The official name of the school.</FormDescription>
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
                    <Input placeholder="ENG" {...field} />
                  </FormControl>
                  <FormDescription>A short code or abbreviation for the school (optional).</FormDescription>
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
                    <Textarea placeholder="A brief description of the school..." className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of the school (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/schools")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : school ? "Update School" : "Create School"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
