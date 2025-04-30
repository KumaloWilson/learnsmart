import { PageHeader } from "@/components/page-header"
import { VirtualClassForm } from "@/components/virtual-class-form"

export default function NewVirtualClassPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <PageHeader
        title="Schedule New Virtual Class"
        description="Create a new online class session for your students"
      />

      <VirtualClassForm />
    </div>
  )
}
