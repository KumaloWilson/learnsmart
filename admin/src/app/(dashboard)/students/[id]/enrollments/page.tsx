import EnrollmentTable from "@/components/students/enrollment-table"

interface EnrollmentsPageProps {
  params: {
    id: string
  }
}

export default function EnrollmentsPage({ params }: EnrollmentsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Enrollments</h1>
        <p className="text-muted-foreground">Manage course enrollments for this student</p>
      </div>

      <EnrollmentTable studentId={params.id} />
    </div>
  )
}
