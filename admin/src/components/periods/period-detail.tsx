"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePeriods } from "@/hooks/use-periods"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Pencil } from "lucide-react"

interface PeriodDetailProps {
  id: string
}

export function PeriodDetail({ id }: PeriodDetailProps) {
  const router = useRouter()
  const { currentPeriod, loadPeriod, isLoading, error } = usePeriods()

  useEffect(() => {
    loadPeriod(id)
  }, [id, loadPeriod])

  if (isLoading.currentPeriod) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!currentPeriod) {
    return (
      <Alert>
        <AlertDescription>Period not found</AlertDescription>
      </Alert>
    )
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    return `${hours}:${minutes}`
  }

  const formatDayOfWeek = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentPeriod.name}</h1>
          <p className="text-muted-foreground">
            {formatDayOfWeek(currentPeriod.dayOfWeek)}, {formatTime(currentPeriod.startTime)} -{" "}
            {formatTime(currentPeriod.endTime)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/periods")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Periods
          </Button>
          <Button size="sm" onClick={() => router.push(`/periods/edit/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Period
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Period Information</CardTitle>
          <CardDescription>Detailed information about the period</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Day of Week</h3>
              <p className="text-sm text-muted-foreground capitalize">{formatDayOfWeek(currentPeriod.dayOfWeek)}</p>
            </div>
            <div>
              <h3 className="font-medium">Time</h3>
              <p className="text-sm text-muted-foreground">
                {formatTime(currentPeriod.startTime)} - {formatTime(currentPeriod.endTime)}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Semester</h3>
            <p className="text-sm text-muted-foreground">{currentPeriod.semester?.name || "Unknown Semester"}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Created</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentPeriod.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium">Last Updated</h3>
              <p className="text-sm text-muted-foreground">{new Date(currentPeriod.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
