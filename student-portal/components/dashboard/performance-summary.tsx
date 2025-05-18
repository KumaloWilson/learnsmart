"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppSelector } from "@/lib/redux/hooks"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetDashboardQuery } from "@/lib/api/dashboard"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

export function PerformanceSummary() {
  const { profile } = useAppSelector((state) => state.student)

  const { data: dashboardData, isLoading } = useGetDashboardQuery(profile?.id || "", {
    skip: !profile?.id,
  })

  const performanceSummary = dashboardData?.performanceSummary?.[0]

  // Function to determine performance trend icon
  const getPerformanceIcon = (category: string | undefined) => {
    if (!category) return <Minus className="h-4 w-4 text-muted-foreground" />

    switch (category) {
      case "excellent":
      case "good":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "average":
        return <Minus className="h-4 w-4 text-amber-500" />
      case "poor":
      case "failing":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Function to get color based on performance category
  const getPerformanceColor = (category: string | undefined) => {
    if (!category) return "text-muted-foreground"

    switch (category) {
      case "excellent":
        return "text-green-600 dark:text-green-400"
      case "good":
        return "text-emerald-600 dark:text-emerald-400"
      case "average":
        return "text-amber-600 dark:text-amber-400"
      case "poor":
        return "text-orange-600 dark:text-orange-400"
      case "failing":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Performance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </>
        ) : performanceSummary ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Overall Performance</h3>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-medium ${getPerformanceColor(performanceSummary.performanceCategory)}`}>
                  {performanceSummary.performanceCategory.charAt(0).toUpperCase() +
                    performanceSummary.performanceCategory.slice(1)}
                </span>
                {getPerformanceIcon(performanceSummary.performanceCategory)}
              </div>
            </div>
            <Progress value={performanceSummary.overallPerformance} className="h-2 mb-1" />
            <div className="flex justify-between text-xs text-muted-foreground mb-4">
              <span>0%</span>
              <span>100%</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Attendance</span>
                  <span className="text-sm font-medium">{performanceSummary.attendancePercentage}%</span>
                </div>
                <Progress value={performanceSummary.attendancePercentage} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Assignments</span>
                  <span className="text-sm font-medium">{performanceSummary.assignmentAverage}%</span>
                </div>
                <Progress value={performanceSummary.assignmentAverage} className="h-1.5" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Quizzes</span>
                  <span className="text-sm font-medium">{performanceSummary.quizAverage}%</span>
                </div>
                <Progress value={performanceSummary.quizAverage} className="h-1.5" />
              </div>
            </div>

            {performanceSummary.strengths || performanceSummary.weaknesses ? (
              <div className="mt-4 pt-4 border-t text-sm">
                {performanceSummary.strengths && (
                  <div className="mb-2">
                    <span className="font-medium text-green-600 dark:text-green-400">Strengths: </span>
                    <span className="text-muted-foreground">{performanceSummary.strengths}</span>
                  </div>
                )}
                {performanceSummary.weaknesses && (
                  <div>
                    <span className="font-medium text-red-600 dark:text-red-400">Areas for Improvement: </span>
                    <span className="text-muted-foreground">{performanceSummary.weaknesses}</span>
                  </div>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground">No performance data available yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
