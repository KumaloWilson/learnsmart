import { PageHeader } from "@/components/page-header"
import { VirtualClassesTable } from "@/components/virtual-classes-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function VirtualClassesPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <PageHeader title="Virtual Classes" description="Schedule and manage your online classes" />
        <Link href="/virtual-classes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Schedule New Class
          </Button>
        </Link>
      </div>

      <VirtualClassesTable />
    </div>
  )
}
