"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CourseForm } from "../../../components/course-form"
import { PageHeader } from "../../../components/page-header"
import { useToast } from "../../../components/ui/use-toast"
import { fetchWithAuth } from "../../../lib/api-helpers"

export default function NewCoursePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetchWithAuth("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create course")
      }

      toast({
        title: "Success",
        description: "Course created successfully",
      })
      router.push("/courses")
      router.refresh()
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Create New Course" text="Add a new course to the system" />
      <div className="mt-8">
        <CourseForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
