import { PageHeader } from "@/components/page-header"
import { StudentForm } from "@/components/student-form"

export default function EditStudentPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Edit Student" text="Update student information and profile details." />
      <div className="mt-8">
        <StudentForm studentId={params.id} isEdit={true} />
      </div>
    </div>
  )
}
