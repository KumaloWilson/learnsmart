import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { MaterialsList } from "@/components/materials/materials-list"
import { MaterialsListSkeleton } from "@/components/skeletons/materials-list-skeleton"
import { MaterialFilters } from "@/components/materials/material-filters"
import { getMaterials } from "@/lib/api/materials-api"

export const metadata: Metadata = {
  title: "Learning Materials | Learn Smart",
  description: "Access learning materials for your courses",
}

async function getMaterialsList() {
  try {
    return await getMaterials()
  } catch (error) {
    console.error("Failed to fetch materials:", error)
    return []
  }
}

export default async function MaterialsPage() {
  const materials = await getMaterialsList()

  return (
    <DashboardShell>
      <DashboardHeader heading="Learning Materials" text="Access learning materials for your courses" />

      <MaterialFilters />

      <Suspense fallback={<MaterialsListSkeleton />}>
        <MaterialsList materials={materials} />
      </Suspense>
    </DashboardShell>
  )
}
