import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VirtualClassesList } from "@/components/virtual-classes/virtual-classes-list"
import { VirtualClassesListSkeleton } from "@/components/skeletons/virtual-classes-list-skeleton"
import { VirtualClassFilters } from "@/components/virtual-classes/virtual-class-filters"

export const metadata: Metadata = {
  title: "Virtual Classes | Learn Smart",
  description: "Join virtual classes for your courses",
}

export default function VirtualClassesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Virtual Classes" text="Join live virtual classes for your courses" />

      <VirtualClassFilters />

      <Suspense fallback={<VirtualClassesListSkeleton />}>
        <VirtualClassesList />
      </Suspense>
    </DashboardShell>
  )
}
