import AcademicRecordDetail from "@/components/students/academic-record-detail"

interface AcademicRecordPageProps {
  params: {
    id: string
    recordId: string
  }
}

export default function AcademicRecordPage({ params }: AcademicRecordPageProps) {
  return <AcademicRecordDetail studentId={params.id} recordId={params.recordId} />
}
