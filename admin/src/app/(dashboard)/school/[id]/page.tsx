import { SchoolDetail } from "@/components/schools/school-detail"
import { useParams } from "next/navigation"


export default function SchoolPage() {

    const params = useParams()
  
    const id = params.id as string

  return <SchoolDetail id={id} />
}
