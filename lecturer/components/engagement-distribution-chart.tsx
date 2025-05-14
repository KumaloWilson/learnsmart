"use client"

import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { EngagementDistribution } from "@/lib/auth/types"

interface EngagementDistributionChartProps {
  distribution: EngagementDistribution
}

export function EngagementDistributionChart({ distribution }: EngagementDistributionChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Format data for the chart
  const data = [
    { name: "Very High", value: distribution.veryHigh, color: "#10b981" },
    { name: "High", value: distribution.high, color: "#3b82f6" },
    { name: "Moderate", value: distribution.moderate, color: "#6366f1" },
    { name: "Low", value: distribution.low, color: "#f59e0b" },
    { name: "Very Low", value: distribution.veryLow, color: "#ef4444" },
  ].filter((item) => item.value > 0) // Only include non-zero values

  // If no data, show a message
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No engagement data available</p>
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
          labelLine={true}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#333",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
