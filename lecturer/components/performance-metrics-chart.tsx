"use client"

import type { StudentPerformance } from "@/lib/auth/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PerformanceMetricsChartProps {
  performances: StudentPerformance[]
}

export function PerformanceMetricsChart({ performances }: PerformanceMetricsChartProps) {
  // Group performances by category and calculate averages
  const getMetricsData = () => {
    if (!performances || performances.length === 0) {
      return []
    }

    // Group by performance category
    const groupedByCategory: Record<string, StudentPerformance[]> = {}

    performances.forEach((performance) => {
      const category = performance.performanceCategory
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = []
      }
      groupedByCategory[category].push(performance)
    })

    // Calculate averages for each category
    return Object.entries(groupedByCategory)
      .map(([category, items]) => {
        const count = items.length
        const attendanceSum = items.reduce((sum, item) => sum + item.attendancePercentage, 0)
        const assignmentSum = items.reduce((sum, item) => sum + item.assignmentAverage, 0)
        const quizSum = items.reduce((sum, item) => sum + item.quizAverage, 0)
        const overallSum = items.reduce((sum, item) => sum + item.overallPerformance, 0)

        return {
          category,
          attendance: Math.round(attendanceSum / count),
          assignment: Math.round(assignmentSum / count),
          quiz: Math.round(quizSum / count),
          overall: Math.round(overallSum / count),
          count,
        }
      })
      .sort((a, b) => {
        const order = ["excellent", "good", "average", "poor", "failing"]
        return order.indexOf(a.category.toLowerCase()) - order.indexOf(b.category.toLowerCase())
      })
  }

  const metricsData = getMetricsData()

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
        data={metricsData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`${value}%`, ""]}
          labelFormatter={(label) =>
            `Category: ${label} (${metricsData.find((d) => d.category === label)?.count || 0} students)`
          }
        />
        <Legend />
        <Bar dataKey="attendance" name="Attendance" fill="#3b82f6" />
        <Bar dataKey="assignment" name="Assignment" fill="#22c55e" />
        <Bar dataKey="quiz" name="Quiz" fill="#eab308" />
        <Bar dataKey="overall" name="Overall" fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  )
}
