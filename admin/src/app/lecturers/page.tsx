import { PageHeader } from "@/components/page-header"
import { LecturersTable } from "@/components/lecturers-table"

export default function LecturersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Lecturer Management"
        subheading="Manage lecturer profiles, course assignments, and teaching materials"
      />
      <LecturersTable />
    </div>
  )
}
