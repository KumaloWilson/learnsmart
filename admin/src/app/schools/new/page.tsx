import { PageHeader } from "../../../components/page-header";
import { SchoolForm } from "../../../components/school-form";

export default function NewSchoolPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader heading="Add School" text="Create a new school in the system" />

      <div className="mx-auto max-w-2xl">
        <SchoolForm />
      </div>
    </div>
  )
}
