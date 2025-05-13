"use client"

import { useEffect } from "react"
import AcademicRecordForm from "@/components/students/academic-record-form"
import { useStudents } from "@/hooks/use-students"
import { useParams } from "next/navigation"


export default function EditAcademicRecordPage() {

    const params = useParams()
  
    const id = params.id as string
    const recordId = params.recordId as string



  const { academicRecords, getAcademicRecordById } = useStudents()

  useEffect(() => {
    getAcademicRecordById(recordId)
  }, [recordId, getAcademicRecordById])

  const academicRecord = academicRecords.find((record) => record.id === recordId)

  if (!academicRecord) {
    return <div className="flex justify-center p-8">Loading academic record...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Academic Record</h1>
        <p className="text-muted-foreground">Update academic record information</p>
      </div>

      <AcademicRecordForm studentId={id} recordId={academicRecord.id} />
    </div>
  )
}
