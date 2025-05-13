"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PeriodTable } from "@/components/periods/period-table"
import { usePeriods } from "@/hooks/use-periods"
import { Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PeriodsManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const { loadPeriods, error } = usePeriods()

  useEffect(() => {
    loadPeriods()
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to load periods. Please try again.",
          variant: "destructive",
        })
        console.error("Failed to load periods:", err)
      })
  }, []) // Remove loadPeriods from dependencies to prevent infinite loop

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

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