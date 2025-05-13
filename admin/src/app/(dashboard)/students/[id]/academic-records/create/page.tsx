import AcademicRecordForm from "@/components/students/academic-record-form"

interface CreateAcademicRecordPageProps {
  params: {
    id: string
  }
}

export default function CreateAcademicRecordPage({ params }: CreateAcademicRecordPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Academic Record</h1>
        <p className="text-muted-foreground">Add a new academic record for this student</p>
      </div>

      <AcademicRecordForm studentId={params.id} />
    </div>
  )
}
