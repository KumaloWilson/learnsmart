"use client"

import { useEffect } from "react"
import { PeriodForm } from "@/components/periods/period-form"
import { usePeriods } from "@/hooks/use-periods"
import { Skeleton } from "@/components/ui/skeleton"

interface EditPeriodPageProps {
  params: {
    id: string
  }
}

export default function EditPeriodPage({ params }: EditPeriodPageProps) {
  const { id } = params
  const { currentPeriod, loadPeriod, isLoading } = usePeriods()

  useEffect(() => {
    loadPeriod(id)
  }, [id, loadPeriod])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Period</h1>
        <p className="text-muted-foreground">Update period information</p>
      </div>

      {isLoading.currentPeriod ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      ) : (
        <PeriodForm period={currentPeriod!} isEdit />
      )}
    </div>
  )
}
