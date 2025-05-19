"use client"

import { useEffect } from "react"
import { CourseForm } from "@/components/courses/course-form"
import { useCourses } from "@/hooks/use-courses"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"


export default function EditCoursePage() {
    const params = useParams()
  
    const id = params.id as string
  const { currentCourse, loadCourse, isLoading } = useCourses()

  useEffect(() => {
    loadCourse(id)
  }, [id, loadCourse])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
        <p className="text-muted-foreground">Update course information</p>
      </div>

      {isLoading.currentCourse ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        <CourseForm course={currentCourse!} isEdit />
      )}
    </div>
  )
}
