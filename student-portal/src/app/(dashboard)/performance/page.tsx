import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PerformanceOverview } from "@/components/performance/performance-overview"
import { PerformanceOverviewSkeleton } from "@/components/skeletons/performance-overview-skeleton"
import { PerformanceFilters } from "@/components/performance/performance-filters"
import { PerformanceDetails } from "@/components/performance/performance-details"
import { PerformanceDetailsSkeleton } from "@/components/skeletons/performance-details-skeleton"

export const metadata: Metadata = {
  title: "Academic Performance | Learn Smart",
  description: "View your academic performance",
}

export default function PerformancePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Academic Performance" text="Track your academic progress and performance" />

      <PerformanceFilters />

      <div className="grid gap-6">
        <Suspense fallback={<PerformanceOverviewSkeleton />}>
          <PerformanceOverview />
        </Suspense>

        <Suspense fallback={<PerformanceDetailsSkeleton />}>
          <PerformanceDetails />
        </Suspense>
      </div>
    </DashboardShell>
  )
}
