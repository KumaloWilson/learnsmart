import AcademicRecordDetail from "@/components/students/academic-record-detail"
import { useParams } from "next/navigation"



export default function AcademicRecordPage() {


    const params = useParams()
  
    const id = params.id as string
    const recordId = params.recordId as string

    if (!id || !recordId) {
        return null
    }

  return <AcademicRecordDetail studentId={id} recordId={recordId} />
}
