import { Suspense } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MaterialDetails } from "@/components/materials/material-details"
import { MaterialDetailsSkeleton } from "@/components/skeletons/material-details-skeleton"
import { getMaterialById } from "@/lib/api/materials-api"

export const metadata: Metadata = {
  title: "Material Details | Learn Smart",
  description: "View learning material",
}

interface MaterialPageProps {
  params: {
    id: string
  }
}

export default async function MaterialPage({ params }: MaterialPageProps) {
  const materialId = params.id

  try {
    // This is a server component, so we can fetch data directly
    const material = await getMaterialById(materialId)
    
    if (!material) {
      notFound()
    }

    return (
      <DashboardShell>
        <DashboardHeader heading={material.title} text={`${material.type} - ${material.course?.name || "Course"}`} />

        <Suspense fallback={<MaterialDetailsSkeleton />}>
          <MaterialDetails material={material} />
        </Suspense>
      </DashboardShell>
    )
  } catch (error) {
    console.error("Error fetching material:", error)
    notFound()
  }
}
