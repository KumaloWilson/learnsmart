import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { VirtualClassDetails } from "@/components/virtual-classes/virtual-class-details"
import { VirtualClassDetailsSkeleton } from "@/components/skeletons/virtual-class-details-skeleton"
import { getVirtualClassById } from "@/lib/api/virtual-classes-api"

export const metadata: Metadata = {
  title: "Virtual Class | Learn Smart",
  description: "Join a virtual class",
}

interface VirtualClassPageProps {
  params: {
    id: string
  }
}

export default async function VirtualClassPage({ params }: VirtualClassPageProps) {
  const virtualClassId = params.id

  try {
    // This is a server component, so we can fetch data directly
    const virtualClass = await getVirtualClassById(virtualClassId)

    return (
      <DashboardShell>
        <DashboardHeader
          heading={virtualClass.title}
          text={`Scheduled: ${new Date(virtualClass.scheduledStartTime).toLocaleString()}`}
        />

        <Suspense fallback={<VirtualClassDetailsSkeleton />}>
          <VirtualClassDetails virtualClass={virtualClass} />
        </Suspense>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error fetching virtual class:", error)
    notFound()
  }
}
