import { PageHeader } from "@/components/page-header"
import { MaterialDetails } from "@/components/material-details"

export default function MaterialDetailsPage({ params }: { params: { id: string } }) {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <PageHeader title="Material Details" description="View and manage teaching material" />

      <MaterialDetails id={params.id} />
    </div>
  )
}
