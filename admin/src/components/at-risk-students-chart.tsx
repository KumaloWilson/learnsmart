"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/api-helpers"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface AtRiskData {
  programName: string
  count: number
  percentage: number
}

export function AtRiskStudentsChart() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState<AtRiskData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchWithAuth("/dashboard/at-risk-students")
        setData(response || [])
      } catch (err) {
        console.error("Failed to fetch at-risk students data:", err)
        setError("Failed to load at-risk students data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-3 w-[100px]" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (data.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No at-risk students data available</div>
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.programName} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{item.programName}</span>
            <span className="text-sm text-muted-foreground">{item.count} students</span>
          </div>
          <Progress value={item.percentage} className="h-2" />
          <p className="text-xs text-muted-foreground">{item.percentage}% of program students</p>
        </div>
      ))}
    </div>
  )
}
