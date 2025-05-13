import { SchoolDetail } from "@/components/schools/school-detail"

interface SchoolPageProps {
  params: {
    id: string
  }
}

export default function SchoolPage({ params }: SchoolPageProps) {
  return <SchoolDetail id={params.id} />
}
