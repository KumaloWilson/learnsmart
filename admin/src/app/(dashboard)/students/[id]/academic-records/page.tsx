import AcademicRecordTable from "@/components/students/academic-record-table"

export default function StudentAcademicRecordsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Records</h1>
        <p className="text-muted-foreground">View and manage academic records for this student</p>
      </div>

      <AcademicRecordTable studentId={params.id} />
    </div>
  )
}
