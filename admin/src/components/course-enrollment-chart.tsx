"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { fetchWithAuth } from "@/lib/api-helpers"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface EnrollmentData {
  name: string
  students: number
}

export function CourseEnrollmentChart() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState<EnrollmentData[]>([])
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
        const response = await fetchWithAuth("/dashboard/course-enrollments")
        setData(response || [])
      } catch (err) {
        console.error("Failed to fetch course enrollment data:", err)
        setError("Failed to load course enrollment data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <Skeleton className="h-[250px] w-full" />
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
    return <div className="text-center py-6 text-muted-foreground">No course enrollment data available</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
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
