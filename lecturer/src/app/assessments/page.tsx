import { Suspense } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/page-header"
import { AssessmentsTable } from "@/components/assessments-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function AssessmentsPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <PageHeader title="Assessments" description="Create and manage assessments for your courses" />
        <Button asChild>
          <Link href="/assessments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Assessment
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <AssessmentsTable />
      </Suspense>
    </div>
  )
}
