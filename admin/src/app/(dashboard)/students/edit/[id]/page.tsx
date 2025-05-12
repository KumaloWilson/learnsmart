import StudentForm from "@/components/students/student-form"

export default function EditStudentPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
        <p className="text-muted-foreground">Update student information</p>
      </div>

      <StudentForm studentId={params.id} />
    </div>
  )
}
