"use client"

import { useEffect } from "react"
import StudentForm from "@/components/students/student-form"
import { useStudents } from "@/hooks/use-students"

interface EditStudentPageProps {
  params: {
    id: string
  }
}

export default function EditStudentPage({ params }: EditStudentPageProps) {
  const { id } = params
  const { currentStudent, loadStudentById } = useStudents()

  useEffect(() => {
    loadStudentById(id)
  }, [id, loadStudentById])

  if (!currentStudent) {
    return <div className="flex justify-center p-8">Loading student...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
        <p className="text-muted-foreground">Update student information</p>
      </div>

      <StudentForm student={currentStudent} />
    </div>
  )
}
