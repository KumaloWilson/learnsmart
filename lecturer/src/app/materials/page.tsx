import { PageHeader } from "@/components/page-header"
import { TeachingMaterialsTable } from "@/components/teaching-materials-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function TeachingMaterialsPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <PageHeader title="Teaching Materials" description="Manage learning resources for your courses" />
        <Link href="/materials/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Upload Material
          </Button>
        </Link>
      </div>

      <TeachingMaterialsTable />
    </div>
  )
}
