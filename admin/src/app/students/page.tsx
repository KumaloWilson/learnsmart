import { AdminSidebar } from "@/components/admin-sidebar"
import { PageHeader } from "@/components/page-header"
import { StudentsTable } from "@/components/student-table"


export default function StudentsPage() {
  return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />

      <div className="flex-1 p-8">

      <PageHeader title="Student Management" description="View and manage all students in the system." />
      <div className="mt-8">
        <StudentsTable />
      </div>


      </div>
    </div>
  )
}
