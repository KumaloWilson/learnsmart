import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { PerformanceSummary } from "../types"


interface PerformanceInsightsProps {
  performanceSummary: PerformanceSummary[]
}

export function PerformanceInsights({ performanceSummary }: PerformanceInsightsProps) {
  if (!performanceSummary.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>No performance data available at this time.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {performanceSummary.map((performance) => {
        const {
          course,
          attendancePercentage,
          assignmentAverage,
          quizAverage,
          overallPerformance,
          performanceCategory,
          strengths,
          weaknesses,
          recommendations,
        } = performance

        // Determine alert variant based on performance category
        const alertVariant =
          performanceCategory === "excellent" || performanceCategory === "good"
            ? "default"
            : performanceCategory === "average"
              ? "outline"
              : "destructive"

        // Determine alert icon based on performance category
        const AlertIcon =
          performanceCategory === "excellent" || performanceCategory === "good" ? CheckCircle : AlertTriangle

        return (
          <Card key={performance.id}>
            <CardHeader>
              <CardTitle>Performance Insights: {course.name}</CardTitle>
              <CardDescription>
                {course.code} • Last updated: {new Date(performance.lastUpdated).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Attendance</span>
                    <span className="text-sm">{attendancePercentage}%</span>
                  </div>
                  <Progress value={attendancePercentage} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Assignments</span>
                    <span className="text-sm">{assignmentAverage}%</span>
                  </div>
                  <Progress value={assignmentAverage} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quizzes</span>
                    <span className="text-sm">{quizAverage}%</span>
                  </div>
                  <Progress value={quizAverage} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall</span>
                    <span className="text-sm">{overallPerformance}%</span>
                  </div>
                  <Progress value={overallPerformance} />
                </div>
              </div>

              <Alert variant={alertVariant as "default" | "destructive" | undefined}>
  <AlertIcon className="h-4 w-4" />
  <AlertTitle className="capitalize">{performanceCategory} Performance</AlertTitle>
  <AlertDescription>{recommendations}</AlertDescription>
</Alert>


              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Strengths</h4>
                  <p className="text-sm text-muted-foreground">{strengths}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                  <p className="text-sm text-muted-foreground">{weaknesses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
