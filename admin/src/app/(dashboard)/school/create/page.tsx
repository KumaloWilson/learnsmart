import { SchoolForm } from "@/components/schools/school-form"

export default function CreateSchoolPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create School</h1>
        <p className="text-muted-foreground">Add a new school to the system</p>
      </div>

      <SchoolForm />
    </div>
  )
}
