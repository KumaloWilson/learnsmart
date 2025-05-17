"use client"
import type { StudentPerformance } from "@/lib/auth/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PerformanceDistributionChartProps {
  performances: StudentPerformance[]
}

export function PerformanceDistributionChart({ performances }: PerformanceDistributionChartProps) {
  // Create performance distribution data
  const getDistributionData = () => {
    if (!performances || performances.length === 0) {
      return []
    }

    // Create ranges for performance scores
    const ranges = [
      { name: "0-20%", min: 0, max: 20, count: 0 },
      { name: "21-40%", min: 21, max: 40, count: 0 },
      { name: "41-60%", min: 41, max: 60, count: 0 },
      { name: "61-80%", min: 61, max: 80, count: 0 },
      { name: "81-100%", min: 81, max: 100, count: 0 },
    ]

    // Count performances in each range
    performances.forEach((performance) => {
      const score = performance.overallPerformance
      const range = ranges.find((r) => score >= r.min && score <= r.max)
      if (range) {
        range.count++
      }
    })

    return ranges
  }

  const distributionData = getDistributionData()

  if (performances.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No performance data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={distributionData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`${value} students`, "Count"]}
          labelFormatter={(label) => `Performance Range: ${label}`}
        />
        <Legend />
        <Bar dataKey="count" name="Number of Students" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  )
}
