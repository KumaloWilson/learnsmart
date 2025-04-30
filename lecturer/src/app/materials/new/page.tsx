import { PageHeader } from "@/components/page-header"
import { MaterialUploadForm } from "@/components/material-upload-form"

export default function NewMaterialPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <PageHeader title="Upload Teaching Material" description="Add new learning resources for your students" />

      <MaterialUploadForm />
    </div>
  )
}
