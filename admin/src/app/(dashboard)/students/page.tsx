import StudentTable from "@/components/students/student-table"

export default function StudentsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students Management</h1>
        <p className="text-muted-foreground">Manage student information and records</p>
      </div>

      <StudentTable />
    </div>
  )
}
