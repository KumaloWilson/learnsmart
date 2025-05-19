"use client"

import { useEffect } from "react"
import { CourseAssignmentForm } from "@/components/lecturers/course-assignment-form"
import { useLecturers } from "@/hooks/use-lecturers"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"


export default function EditCourseAssignmentPage() {

    const params = useParams()
      
    const id = params.id as string
    const assignmentId = params.assignmentId as string


  const { courseAssignments, loadCourseAssignments, isLoading } = useLecturers()

  useEffect(() => {
    loadCourseAssignments(id)
  }, [id, loadCourseAssignments])

  const assignment = courseAssignments.find((a) => a.id === assignmentId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Course Assignment</h1>
        <p className="text-muted-foreground">Update course assignment details</p>
      </div>

      {isLoading.courseAssignments ? (
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
        <CourseAssignmentForm lecturerId={id} assignment={assignment} isEdit />
      )}
    </div>
  )
}
