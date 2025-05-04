import { PageHeader } from "@/components/page-header"
import { LecturerForm } from "@/components/lecturer-form"

export default function NewLecturerPage() {
  return (
    <div className="space-y-6">
      <PageHeader heading="Add New Lecturer" subheading="Create a new lecturer profile" />
      <LecturerForm />
    </div>
  )
}
