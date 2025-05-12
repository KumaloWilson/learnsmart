import EnrollmentForm from "@/components/students/enrollment-form"

interface CreateEnrollmentPageProps {
  params: {
    id: string
  }
}

export default function CreateEnrollmentPage({ params }: CreateEnrollmentPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Enroll in Course</h1>
        <p className="text-muted-foreground">Enroll the student in a course</p>
      </div>

      <EnrollmentForm studentId={params.id} />
    </div>
  )
}
