import { ProgramForm } from "@/components/programs/program-form"

export default function CreateProgramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Program</h1>
        <p className="text-muted-foreground">Add a new program to the system</p>
      </div>

      <ProgramForm />
    </div>
  )
}
