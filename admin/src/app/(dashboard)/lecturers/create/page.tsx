import { LecturerForm } from "@/components/lecturers/lecturer-form"

export default function CreateLecturerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Lecturer</h1>
        <p className="text-muted-foreground">Add a new lecturer to the system</p>
      </div>

      <LecturerForm />
    </div>
  )
}
