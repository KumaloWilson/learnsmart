import { PeriodForm } from "@/components/periods/period-form"

export default function CreatePeriodPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Period</h1>
        <p className="text-muted-foreground">Add a new period to the system</p>
      </div>

      <PeriodForm />
    </div>
  )
}
