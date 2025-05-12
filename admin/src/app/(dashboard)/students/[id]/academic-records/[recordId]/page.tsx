import AcademicRecordDetail from "@/components/students/academic-record-detail"

export default function AcademicRecordDetailPage({ params }: { params: { id: string; recordId: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Record Details</h1>
        <p className="text-muted-foreground">View academic record information</p>
      </div>

      <AcademicRecordDetail studentId={params.id} recordId={params.recordId} />
    </div>
  )
}
