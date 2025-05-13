import { SemesterForm } from "@/components/semesters/semester-form"

export default function CreateSemesterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Semester</h1>
        <p className="text-muted-foreground">Add a new semester to the system</p>
      </div>

      <SemesterForm />
    </div>
  )
}
