import { PageHeader } from "@/components/page-header"
import { SchoolsTable } from "@/components/schools-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function SchoolsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <PageHeader heading="Schools" text="Manage schools in your educational system">
        <Button asChild>
          <Link href="/schools/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add School
          </Link>
        </Button>
      </PageHeader>

      <SchoolsTable />
    </div>
  )
}
