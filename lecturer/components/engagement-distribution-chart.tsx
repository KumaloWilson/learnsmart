"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStudentEngagement } from "@/lib/auth/hooks"
import { useAuth } from "@/lib/auth/auth-context"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface EngagementDistributionChartProps {
  courseId: string
  semesterId: string
}

export function EngagementDistributionChart({ courseId, semesterId }: EngagementDistributionChartProps) {
  const { lecturerProfile } = useAuth()
  const { getStudentEngagement, engagementData, isLoading, error } = useStudentEngagement()
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id && courseId && semesterId && !isInitialLoading && !engagementData) {
        try {
          await getStudentEngagement(lecturerProfile.id, courseId, semesterId)
        } catch (err) {
          console.error("Error fetching student engagement data:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, courseId, semesterId, getStudentEngagement, engagementData, isInitialLoading])

  if (isInitialLoading || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Distribution</CardTitle>
          <CardDescription>Student engagement levels</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading engagement data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Distribution</CardTitle>
          <CardDescription>Student engagement levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!engagementData || !engagementData.engagementDistribution) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Distribution</CardTitle>
          <CardDescription>Student engagement levels</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No engagement data available for this course</p>
        </CardContent>
      </Card>
    )
  }

  const { engagementDistribution } = engagementData

  const chartData = [
    { name: "Very High", value: engagementDistribution.veryHigh, color: "#10b981" },
    { name: "High", value: engagementDistribution.high, color: "#22c55e" },
    { name: "Moderate", value: engagementDistribution.moderate, color: "#eab308" },
    { name: "Low", value: engagementDistribution.low, color: "#f97316" },
    { name: "Very Low", value: engagementDistribution.veryLow, color: "#ef4444" },
  ]

  const COLORS = ["#10b981", "#22c55e", "#eab308", "#f97316", "#ef4444"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Distribution</CardTitle>
        <CardDescription>Student engagement levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Attendance Rate</p>
            <p className="text-2xl font-bold">{engagementData.classAverages.overallAttendanceRate.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Quiz Completion</p>
            <p className="text-2xl font-bold">{engagementData.classAverages.quizCompletionRate.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Assignment Submission</p>
            <p className="text-2xl font-bold">{engagementData.classAverages.assessmentSubmissionRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
