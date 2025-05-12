import { SemesterDetail } from "@/components/semesters/semester-detail"

interface SemesterPageProps {
  params: {
    id: string
  }
}

export default function SemesterPage({ params }: SemesterPageProps) {
  return <SemesterDetail id={params.id} />
}
