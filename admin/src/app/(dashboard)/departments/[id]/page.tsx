import { DepartmentDetail } from "@/components/departments/department-detail"

interface DepartmentPageProps {
  params: {
    id: string
  }
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  return <DepartmentDetail id={params.id} />
}
