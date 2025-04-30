"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

interface EngagementData {
  courseCode: string
  attendance: number
  participation: number
  assignments: number
  quizzes: number
}

export function StudentEngagementChart() {
  const [data, setData] = useState<EngagementData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, fetch from API
    const fetchEngagementData = async () => {
      try {
        // Mock data for demonstration
        const mockData = [
          {
            courseCode: "CS101",
            attendance: 85,
            participation: 70,
            assignments: 92,
            quizzes: 78,
          },
          {
            courseCode: "CS201",
            attendance: 92,
            participation: 65,
            assignments: 88,
            quizzes: 82,
          },
          {
            courseCode: "CS301",
            attendance: 78,
            participation: 80,
            assignments: 75,
            quizzes: 70,
          },
          {
            courseCode: "CS401",
            attendance: 88,
            participation: 75,
            assignments: 85,
            quizzes: 90,
          },
        ]

        // Simulate API delay
        setTimeout(() => {
          setData(mockData)
          setLoading(false)
        }, 1000)

        // Real API call would be:
        // const response = await fetch('/api/lecturer/analytics/engagement')
        // const data = await response.json()
        // setData(data)
      } catch (error) {
        console.error("Failed to fetch engagement data:", error)
        setLoading(false)
      }
    }

    fetchEngagementData()
  }, [])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="courseCode" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-3 shadow-lg border">
                  <p className="font-medium">{label}</p>
                  {payload.map((entry, index) => (
                    <div key={`item-${index}`} className="flex items-center justify-between gap-2">
                      <span style={{ color: entry.color }}>{entry.name}:</span>
                      <span className="font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </Card>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar dataKey="attendance" name="Attendance" fill="#4f46e5" />
        <Bar dataKey="participation" name="Participation" fill="#10b981" />
        <Bar dataKey="assignments" name="Assignments" fill="#f59e0b" />
        <Bar dataKey="quizzes" name="Quizzes" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
