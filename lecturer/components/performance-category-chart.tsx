"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PerformanceCategoryChartProps {
  distribution: {
    excellent: number
    good: number
    average: number
    poor: number
    failing: number
  }
}

export function PerformanceCategoryChart({ distribution }: PerformanceCategoryChartProps) {
  const data = [
    { name: "Excellent", value: distribution.excellent, color: "#22c55e" },
    { name: "Good", value: distribution.good, color: "#3b82f6" },
    { name: "Average", value: distribution.average, color: "#eab308" },
    { name: "Poor", value: distribution.poor, color: "#f97316" },
    { name: "Failing", value: distribution.failing, color: "#ef4444" },
  ].filter((item) => item.value > 0)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No category data available</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} students`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
