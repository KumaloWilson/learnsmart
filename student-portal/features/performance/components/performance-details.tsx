import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, CheckCircle, Clock, Calendar } from "lucide-react"
import type { PerformanceData } from "@/features/performance/types"

interface PerformanceDetailsProps {
  performanceData: PerformanceData
}

export function PerformanceDetails({ performanceData }: PerformanceDetailsProps) {
  const { course, semester, performanceCategory, strengths, weaknesses, recommendations, lastUpdated } = performanceData

  // Determine alert variant based on performance category
  const alertVariant =
    performanceCategory === "excellent" || performanceCategory === "good"
      ? "default"
      : performanceCategory === "average"
        ? "outline"
        : "destructive"

  // Determine alert icon based on performance category
  const AlertIcon = performanceCategory === "excellent" || performanceCategory === "good" ? CheckCircle : AlertTriangle

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Performance Analysis</CardTitle>
            <CardDescription>
              {course.name} ({course.code}) • {semester.name}
            </CardDescription>
          </div>
          <Badge className="capitalize" variant={alertVariant === "destructive" ? "destructive" : "outline"}>
            {performanceCategory}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              Semester: {new Date(semester.startDate).toLocaleDateString()} -{" "}
              {new Date(semester.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <span>Last updated: {new Date(lastUpdated).toLocaleString()}</span>
          </div>
        </div>

        <Alert variant={alertVariant}>
          <AlertIcon className="h-4 w-4" />
          <AlertTitle className="capitalize">{performanceCategory} Performance</AlertTitle>
          <AlertDescription>{recommendations}</AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Strengths</h3>
          <p className="text-sm text-muted-foreground">{strengths}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Areas for Improvement</h3>
          <p className="text-sm text-muted-foreground">{weaknesses}</p>
        </div>
      </CardContent>
    </Card>
  )
}
