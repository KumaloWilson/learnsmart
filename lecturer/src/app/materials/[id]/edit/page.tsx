import { PageHeader } from "@/components/page-header"
import { MaterialEditForm } from "@/components/material-edit-form"

export default function EditMaterialPage({ params }: { params: { id: string } }) {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <PageHeader title="Edit Teaching Material" description="Update information for this learning resource" />

      <MaterialEditForm id={params.id} />
    </div>
  )
}
