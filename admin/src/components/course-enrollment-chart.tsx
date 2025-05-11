"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface CourseEnrollmentChartProps {
  data: {
    name: string
    total: number
  }[]
}

export function CourseEnrollmentChart({ data }: CourseEnrollmentChartProps) {
  // Sort data by enrollment count (highest first)
  const sortedData = [...data].sort((a, b) => b.total - a.total).slice(0, 5)

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            scale="band"
            width={120}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "none",
            }}
            formatter={(value: number) => [`${value} students`, "Enrollment"]}
            labelFormatter={(label) => `Course: ${label}`}
          />
          <Bar
            dataKey="total"
            fill="#6366f1"
            radius={[0, 4, 4, 0]}
            barSize={30}
            label={{
              position: "right",
              formatter: (value: any) => value,
              fill: "#6366f1",
              fontSize: 12,
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
