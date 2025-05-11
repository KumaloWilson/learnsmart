"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { getPerformance } from "@/lib/api/performance-api"
import { BarChart, LineChart, PieChart } from "@/components/charts"

export function PerformanceOverview() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [performanceData, setPerformanceData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentProfileId) return

      setIsLoading(true)
      try {
        const data = await getPerformance(user.studentProfileId)
        setPerformanceData(data)
      } catch (error) {
        console.error("Error fetching performance data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load performance data. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, toast])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!performanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
          <CardDescription>No performance data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No performance data is available yet. Complete assessments and quizzes to see your performance.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock data for charts
  const gradeDistribution = {
    labels: ["A", "B", "C", "D", "F"],
    datasets: [
      {
        label: "Grade Distribution",
        data: [30, 40, 20, 5, 5],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(250, 204, 21, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgb(34, 197, 94)",
          "rgb(59, 130, 246)",
          "rgb(250, 204, 21)",
          "rgb(249, 115, 22)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const progressOverTime = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Your Performance",
        data: [65, 70, 75, 72, 80, 85],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "Class Average",
        data: [60, 65, 68, 70, 72, 75],
        borderColor: "rgb(156, 163, 175)",
        backgroundColor: "rgba(156, 163, 175, 0.5)",
        tension: 0.3,
      },
    ],
  }

  const assessmentScores = {
    labels: ["Quiz 1", "Assignment 1", "Midterm", "Quiz 2", "Assignment 2", "Final"],
    datasets: [
      {
        label: "Your Score",
        data: [85, 78, 90, 82, 88, 92],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
      {
        label: "Class Average",
        data: [75, 72, 80, 76, 78, 82],
        backgroundColor: "rgba(156, 163, 175, 0.7)",
        borderColor: "rgb(156, 163, 175)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
        <CardDescription>View your academic performance across all courses</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">GPA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{performanceData.gpa || "3.7"}</div>
                  <p className="text-sm text-muted-foreground">out of 4.0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Completed Credits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{performanceData.completedCredits || "45"}</div>
                  <p className="text-sm text-muted-foreground">out of {performanceData.totalCredits || "120"}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Course Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{performanceData.courseCompletionRate || "85"}%</div>
                  <p className="text-sm text-muted-foreground">Average completion rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="h-[300px]">
              <PieChart data={gradeDistribution} />
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="h-[400px]">
              <LineChart data={progressOverTime} />
            </div>
          </TabsContent>

          <TabsContent value="assessments">
            <div className="h-[400px]">
              <BarChart data={assessmentScores} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
