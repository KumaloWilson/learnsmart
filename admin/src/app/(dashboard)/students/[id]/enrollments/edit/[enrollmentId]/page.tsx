"use client"

import { useEffect } from "react"
import EnrollmentForm from "@/components/students/enrollment-form"
import { useStudents } from "@/hooks/use-students"
import { useParams } from "next/navigation"


export default function EditEnrollmentPage() {
  
  const params = useParams()
  const id = params.id as string
  const enrollmentId = params.enrollmentId as string
  

  const { enrollments, getStudentEnrollments } = useStudents()

  useEffect(() => {
    getStudentEnrollments(id)
  }, [id, getStudentEnrollments])

  const enrollment = enrollments.find((e) => e.id === enrollmentId)

  if (!enrollment) {
    return <div className="flex justify-center p-8">Loading enrollment...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Enrollment</h1>
        <p className="text-muted-foreground">Update enrollment status and grade</p>
      </div>

      <EnrollmentForm studentId={id} enrollmentId={enrollment.id} />
    </div>
  )
}
