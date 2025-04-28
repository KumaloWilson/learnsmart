"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { CourseForm } from "../../../components/course-form"
import { useToast } from "../../../hooks/use-toast"
import { fetchWithAuth } from "../../../lib/api-helpers"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [course, setCourse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetchWithAuth(`/api/courses/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch course")
        }
        const data = await response.json()
        setCourse(data)
      } catch (error) {
        console.error("Error fetching course:", error)
        toast({
          title: "Error",
          description: "Failed to fetch course details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [params.id, toast])

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await fetchWithAuth(`/api/courses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update course")
      }

      toast({
        title: "Success",
        description: "Course updated successfully",
      })
      router.push("/courses")
      router.refresh()
    } catch (error) {
      console.error("Error updating course:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update course",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-12 w-[250px] mb-4" />
        <Skeleton className="h-6 w-[350px] mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-32 w-full max-w-md" />
          <Skeleton className="h-10 w-full max-w-md" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[100px]" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader heading="Course Not Found" text="The requested course could not be found" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading={`Edit Course: ${course.name}`} text="Update course details" />
      <div className="mt-8">
        <CourseForm
          initialData={{
            code: course.code,
            name: course.name,
            description: course.description,
            credits: course.credits,
            programId: course.programId,
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
