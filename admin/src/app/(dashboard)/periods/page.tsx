"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PeriodTable } from "@/components/periods/period-table"
import { usePeriods } from "@/hooks/use-periods"
import { Plus } from "lucide-react"

export default function PeriodsManagement() {
  const router = useRouter()
  const { loadPeriods } = usePeriods()

  useEffect(() => {
    loadPeriods()
  }, [loadPeriods])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Periods Management</h1>
          <p className="text-muted-foreground">Manage academic periods and schedules</p>
        </div>
        <Button onClick={() => router.push("/periods/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Period
        </Button>
      </div>

      <PeriodTable />
    </div>
  )
}
