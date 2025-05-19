"use client"
import EnrollmentTable from "@/components/students/enrollment-table"
import { useParams } from "next/navigation"


export default function EnrollmentsPage() {

  const params = useParams()
  const id = params.id as string


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Enrollments</h1>
        <p className="text-muted-foreground">Manage course enrollments for this student</p>
      </div>

      <EnrollmentTable studentId={id} />
    </div>
  )
}
