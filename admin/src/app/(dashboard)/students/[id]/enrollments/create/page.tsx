"use client"
import EnrollmentForm from "@/components/students/enrollment-form"
import { useParams } from "next/navigation"



export default function CreateEnrollmentPage() {

    const params = useParams()
  
    const id = params.id as string


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enroll in Course</h1>
        <p className="text-muted-foreground">Enroll the student in a course</p>
      </div>

      <EnrollmentForm studentId={id} />
    </div>
  )
}
