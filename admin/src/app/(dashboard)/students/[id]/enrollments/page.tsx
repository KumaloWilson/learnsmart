import EnrollmentTable from "@/components/students/enrollment-table"

export default function StudentEnrollmentsPage({ params }: { params: { id: string } }) {
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
