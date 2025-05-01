"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { useAppDispatch } from "@/store"
import { createCourse } from "@/store/slices/courses-slice"
import { CourseForm } from "@/components/course-form"
import { useToast } from "@/components/ui/use-toast"

export default function NewCoursePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await dispatch(createCourse(data)).unwrap()

      toast({
        title: "Success",
        description: "Course created successfully",
      })

      router.push("/courses")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader title="Create Course" description="Add a new course to the system" />
      <div className="mt-6">
        <CourseForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  )
}
