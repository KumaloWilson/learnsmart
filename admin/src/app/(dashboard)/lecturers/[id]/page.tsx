import { LecturerDetail } from "@/components/lecturers/lecturer-detail"

interface LecturerPageProps {
  params: {
    id: string
  }
}

export default function LecturerPage({ params }: LecturerPageProps) {
  return <LecturerDetail id={params.id} />
}
