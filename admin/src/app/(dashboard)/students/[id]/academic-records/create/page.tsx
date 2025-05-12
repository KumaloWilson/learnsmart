import AcademicRecordForm from "@/components/students/academic-record-form"

export default function CreateAcademicRecordPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Academic Record</h1>
        <p className="text-muted-foreground">Create a new academic record</p>
      </div>

      <AcademicRecordForm studentId={params.id} />
    </div>
  )
}
