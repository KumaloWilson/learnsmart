import StudentDetail from "@/components/students/student-detail"

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Details</h1>
        <p className="text-muted-foreground">View student information</p>
      </div>

      <StudentDetail studentId={params.id} />
    </div>
  )
}
