"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { fetchWithAuth } from "@/lib/api-helpers"
import { useAuth } from "@/hooks/use-auth"

interface EnrollmentData {
  name: string
  students: number
}

export function CourseEnrollmentChart() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState<EnrollmentData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        // Don't fetch if not authenticated yet
        return
      }

      try {
        const response = await fetchWithAuth("/dashboard/course-enrollments")
        if (response) {
          setData(response)
        } else {
          // Fallback data
          setData([
            { name: "Introduction to Programming", students: 120 },
            { name: "Data Structures", students: 85 },
            { name: "Database Systems", students: 95 },
            { name: "Web Development", students: 110 },
            { name: "Machine Learning", students: 65 },
            { name: "Software Engineering", students: 75 },
            { name: "Computer Networks", students: 60 },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch course enrollment data:", error)
        // Fallback data
        setData([
          { name: "Introduction to Programming", students: 120 },
          { name: "Data Structures", students: 85 },
          { name: "Database Systems", students: 95 },
          { name: "Web Development", students: 110 },
          { name: "Machine Learning", students: 65 },
          { name: "Software Engineering", students: 75 },
          { name: "Computer Networks", students: 60 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  if (isLoading) {
    return <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
        />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
