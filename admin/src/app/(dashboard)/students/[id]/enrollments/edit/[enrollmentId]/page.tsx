"use client"

import { useEffect } from "react"
import EnrollmentForm from "@/components/students/enrollment-form"
import { useStudents } from "@/hooks/use-students"

interface EditEnrollmentPageProps {
  params: {
    id: string
    enrollmentId: string
  }
}

export default function EditEnrollmentPage({ params }: EditEnrollmentPageProps) {
  const { id, enrollmentId } = params
  const { enrollments, loadStudentEnrollments } = useStudents()

  useEffect(() => {
    loadStudentEnrollments(id)
  }, [id, loadStudentEnrollments])

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

      <EnrollmentForm studentId={id} enrollment={enrollment} />
    </div>
  )
}
