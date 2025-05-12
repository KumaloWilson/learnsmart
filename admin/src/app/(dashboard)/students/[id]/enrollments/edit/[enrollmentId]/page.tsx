import EnrollmentForm from "@/components/students/enrollment-form"

export default function EditEnrollmentPage({ params }: { params: { id: string; enrollmentId: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Enrollment</h1>
        <p className="text-muted-foreground">Update enrollment information</p>
      </div>

      <EnrollmentForm studentId={params.id} enrollmentId={params.enrollmentId} />
    </div>
  )
}
