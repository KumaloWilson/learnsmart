"use client"
import AcademicRecordTable from "@/components/students/academic-record-table"
import { useParams } from "next/navigation"


export default function AcademicRecordsPage() {


    const params = useParams()
  
    const id = params.id as string

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Records</h1>
        <p className="text-muted-foreground">Manage academic records for this student</p>
      </div>

      <AcademicRecordTable studentId={id} />
    </div>
  )
}
