"use client"

import AcademicRecordForm from "@/components/students/academic-record-form"
import { useParams } from "next/navigation"

export default function CreateAcademicRecordPage() {

  const params = useParams()
  const id = params.id as string


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Academic Record</h1>
        <p className="text-muted-foreground">Add a new academic record for this student</p>
      </div>

      <AcademicRecordForm studentId={id} />
    </div>
  )
}
