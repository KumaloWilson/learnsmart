"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCourseMasteryStatistics } from "@/lib/auth/hooks"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { AlertTriangle, CheckCircle } from "lucide-react"

interface CourseMasteryStatisticsProps {
  courseId: string
  semesterId: string
}

export function CourseMasteryStatistics({ courseId, semesterId }: CourseMasteryStatisticsProps) {
  const { masteryStats, loading, error, refetch } = useCourseMasteryStatistics(courseId, semesterId)

  useEffect(() => {
    if (courseId && semesterId) {
      // refetch()
    }
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
          <CardTitle>Course Mastery Statistics</CardTitle>
          <CardDescription>Overview of student mastery for this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>Failed to load course mastery statistics. Please try again later.</p>
            <p className="text-sm text-destructive mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!masteryStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Mastery Statistics</CardTitle>
          <CardDescription>Overview of student mastery for this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>No mastery statistics available for this course.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const pieData = [
    { name: "Above 80%", value: masteryStats.studentsAbove80Percent, color: "#4ade80" },
    {
      name: "Between 40-80%",
      value: masteryStats.totalStudents - masteryStats.studentsAbove80Percent - masteryStats.studentsBelow40Percent,
      color: "#facc15",
    },
    { name: "Below 40%", value: masteryStats.studentsBelow40Percent, color: "#f87171" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Mastery Statistics</CardTitle>
        <CardDescription>Overview of student mastery for this course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Average Mastery</p>
            <p className="text-2xl font-bold">{masteryStats.averageMastery.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Highest Mastery</p>
            <p className="text-2xl font-bold">{masteryStats.highestMastery.toFixed(1)}%</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Median Mastery</p>
            <p className="text-2xl font-bold">{masteryStats.medianMastery.toFixed(1)}%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Strong Performance</p>
                <p className="text-sm text-muted-foreground">
                  {masteryStats.studentsAbove80Percent} students (
                  {Math.round((masteryStats.studentsAbove80Percent / masteryStats.totalStudents) * 100) || 0}%) have
                  mastery levels above 80%
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-medium">Needs Attention</p>
                <p className="text-sm text-muted-foreground">
                  {masteryStats.studentsBelow40Percent} students (
                  {Math.round((masteryStats.studentsBelow40Percent / masteryStats.totalStudents) * 100) || 0}%) have
                  mastery levels below 40%
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Total of <span className="font-medium">{masteryStats.totalStudents}</span> students assessed in this
                course
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
