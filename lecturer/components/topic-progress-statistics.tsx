"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useTopicProgressStatistics } from "@/lib/auth/hooks"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Clock, Award, Users } from "lucide-react"

interface TopicProgressStatisticsProps {
  courseId: string
  semesterId: string
}

export function TopicProgressStatistics({ courseId, semesterId }: TopicProgressStatisticsProps) {
  const { progressStats, loading, error, refetch } = useTopicProgressStatistics(courseId, semesterId)

  useEffect(() => {
    // refetch()
  }, [courseId, semesterId, refetch])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic Progress Statistics</CardTitle>
          <CardDescription>View student progress across course topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>Failed to load topic progress statistics. Please try again later.</p>
            <p className="text-sm text-destructive mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!progressStats || progressStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic Progress Statistics</CardTitle>
          <CardDescription>View student progress across course topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>No topic progress data available for this course.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "#4ade80" // green
      case "intermediate":
        return "#facc15" // yellow
      case "advanced":
        return "#f87171" // red
      default:
        return "#a3a3a3" // gray
    }
  }

  const chartData = progressStats.map((stat) => ({
    name: stat.title,
    completionRate: Math.round(stat.completionRate * 100),
    masteryLevel: Math.round(stat.averageMasteryLevel * 100),
    timeSpent: stat.averageTimeSpent,
    difficulty: stat.difficulty,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Progress Statistics</CardTitle>
        <CardDescription>View student progress across course topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 p-3 rounded-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Average Completion</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  (progressStats.reduce((acc, stat) => acc + stat.completionRate, 0) / progressStats.length) * 100,
                )}
                %
              </p>
            </div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg flex items-center">
            <Award className="h-5 w-5 mr-2 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Average Mastery</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  (progressStats.reduce((acc, stat) => acc + stat.averageMasteryLevel, 0) / progressStats.length) * 100,
                )}
                %
              </p>
            </div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg. Time Spent</p>
              <p className="text-2xl font-bold">
                {Math.round(progressStats.reduce((acc, stat) => acc + stat.averageTimeSpent, 0) / progressStats.length)}{" "}
                min
              </p>
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis
                yAxisId="left"
                orientation="left"
                label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "Time (min)", angle: 90, position: "insideRight" }}
              />
              <Tooltip />
              <Bar yAxisId="left" dataKey="completionRate" name="Completion Rate" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getDifficultyColor(entry.difficulty)} />
                ))}
              </Bar>
              <Bar yAxisId="left" dataKey="masteryLevel" name="Mastery Level" fill="#82ca9d" />
              <Bar yAxisId="right" dataKey="timeSpent" name="Time Spent (min)" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Difficulty Legend:</p>
          <div className="flex flex-wrap gap-2">
            <Badge style={{ backgroundColor: getDifficultyColor("beginner") }}>Beginner</Badge>
            <Badge style={{ backgroundColor: getDifficultyColor("intermediate") }}>Intermediate</Badge>
            <Badge style={{ backgroundColor: getDifficultyColor("advanced") }}>Advanced</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
