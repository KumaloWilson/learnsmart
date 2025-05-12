import StudentDetail from "@/components/students/student-detail"

interface StudentPageProps {
  params: {
    id: string
  }
}

export default function StudentPage({ params }: StudentPageProps) {
  return <StudentDetail id={params.id} />
}
