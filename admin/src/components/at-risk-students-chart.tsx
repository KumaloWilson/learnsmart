"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "../lib/api-helpers"
import { Progress } from "@/components/ui/progress"


interface AtRiskData {
  programName: string
  count: number
  percentage: number
}

export function AtRiskStudentsChart() {
  const [data, setData] = useState<AtRiskData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth("/dashboard/at-risk-students")
        setData(response || [])
      } catch (error) {
        console.error("Failed to fetch at-risk students data:", error)
        // Fallback data
        setData([
          { programName: "Computer Science", count: 12, percentage: 8 },
          { programName: "Business Administration", count: 8, percentage: 5 },
          { programName: "Engineering", count: 15, percentage: 10 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center h-[200px]">Loading chart data...</div>
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
