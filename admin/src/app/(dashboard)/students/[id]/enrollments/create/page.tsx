import EnrollmentForm from "@/components/students/enrollment-form"

export default function CreateEnrollmentPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enroll in Course</h1>
        <p className="text-muted-foreground">Enroll student in a course</p>
      </div>

      <EnrollmentForm studentId={params.id} />
    </div>
  )
}
