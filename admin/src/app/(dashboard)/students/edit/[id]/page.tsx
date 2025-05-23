"use client"

import { useEffect } from "react"
import StudentForm from "@/components/students/student-form"
import { useStudents } from "@/hooks/use-students"
import { useParams } from "next/navigation"


export default function EditStudentPage() {


  const params = useParams()
  const id = params.id as string
 
  
  const { currentStudent, getStudentById } = useStudents()

  useEffect(() => {
    getStudentById(id)
  }, [id, getStudentById])

  if (!currentStudent) {
    return <div className="flex justify-center p-8">Loading student...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
        <p className="text-muted-foreground">Update student information</p>
      </div>

      <StudentForm studentId={currentStudent.id} />
    </div>
  )
}
