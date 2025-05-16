"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCourseMastery } from "@/lib/auth/hooks"
import { useAuth } from "@/lib/auth/auth-context"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CourseMasteryChartProps {
  courseId: string
  semesterId: string
}

export function CourseMasteryChart({ courseId, semesterId }: CourseMasteryChartProps) {
  const { lecturerProfile } = useAuth()
  const { getCourseMasteryDistribution, masteryData, isLoading, error } = useCourseMastery()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && courseId && semesterId && !isInitialLoading && !masteryData) {
        try {
          await getCourseMasteryDistribution(lecturerProfile.id, courseId, semesterId)
        } catch (err) {
          console.error("Error fetching course mastery data:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, courseId, semesterId, getCourseMasteryDistribution, masteryData, isInitialLoading])

  if (isInitialLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Mastery Distribution</CardTitle>
          <CardDescription>Student performance across mastery levels</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading mastery data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Mastery Distribution</CardTitle>
          <CardDescription>Student performance across mastery levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!masteryData || !masteryData.distribution || masteryData.distribution.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Mastery Distribution</CardTitle>
          <CardDescription>Student performance across mastery levels</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No mastery data available for this course</p>
        </CardContent>
      </Card>
    )
  }

  const chartData = masteryData.distribution.map((item) => ({
    name: item.range,
    students: item.count,
    percentage: item.percentage,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Mastery Distribution</CardTitle>
        <CardDescription>Student performance across mastery levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Average Mastery</p>
            <p className="text-2xl font-bold">{masteryData.averageMastery.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Quiz Score</p>
            <p className="text-2xl font-bold">{masteryData.averageQuizScore.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Assignment Score</p>
            <p className="text-2xl font-bold">{masteryData.averageAssignmentScore.toFixed(1)}%</p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="students" name="Students" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="percentage" name="Percentage" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
