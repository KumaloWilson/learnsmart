"use client"

import { CourseAssignmentForm } from "@/components/lecturers/course-assignment-form"
import { useParams } from "next/navigation"


export default function AssignCoursePage() {
    const params = useParams()
  
    const id = params.id as string

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assign Course</h1>
        <p className="text-muted-foreground">Assign a course to this lecturer</p>
      </div>

      <CourseAssignmentForm lecturerId={id} />
    </div>
  )
}
