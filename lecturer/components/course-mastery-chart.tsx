"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { MasteryDistribution } from "@/lib/auth/types"

interface CourseMasteryChartProps {
  distribution: MasteryDistribution[]
}

export function CourseMasteryChart({ distribution }: CourseMasteryChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Format data for the chart
  const data = distribution.map((item) => ({
    name: item.range,
    Students: item.count,
    Percentage: item.percentage,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
        <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} />
        <YAxis yAxisId="left" orientation="left" stroke={isDark ? "#888" : "#666"} />
        <YAxis yAxisId="right" orientation="right" stroke={isDark ? "#888" : "#666"} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#333" : "#fff",
            borderColor: isDark ? "#444" : "#ddd",
            color: isDark ? "#fff" : "#333",
          }}
        />
        <Legend />
        <Bar yAxisId="left" dataKey="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Number of Students" />
        <Bar yAxisId="right" dataKey="Percentage" fill="#10b981" radius={[4, 4, 0, 0]} name="Percentage (%)" />
      </BarChart>
    </ResponsiveContainer>
  )
}
