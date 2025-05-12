import StudentForm from "@/components/students/student-form"

export default function CreateStudentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Student</h1>
        <p className="text-muted-foreground">Add a new student to the system</p>
      </div>

      <StudentForm />
    </div>
  )
}
