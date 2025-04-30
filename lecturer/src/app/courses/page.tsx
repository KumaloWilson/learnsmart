import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import { CoursesTable } from "@/components/courses-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function CoursesPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <PageHeader title="My Courses" description="Manage your assigned courses and teaching materials" />

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <CoursesTable />
      </Suspense>
    </div>
  )
}
