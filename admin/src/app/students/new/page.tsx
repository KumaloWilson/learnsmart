import { PageHeader } from "@/components/page-header"
import { StudentForm } from "@/components/student-form"

export default function NewStudentPage() {
  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Add New Student" text="Create a new student account and profile." />
      <div className="mt-8">
        <StudentForm />
      </div>
    </div>
  )
}
