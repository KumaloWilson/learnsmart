"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { getCourseMastery } from "@/lib/api/course-mastery-api"

export function CourseMasteryOverview() {
  const { user } = useAuth()
  const [masteryData, setMasteryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMasteryData = async () => {
      if (!user?.studentProfileId) return

      try {
        const data = await getCourseMastery(user.studentProfileId)
        setMasteryData(data || [])
      } catch (error) {
        console.error("Error fetching course mastery data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMasteryData()
  }, [user?.studentProfileId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Mastery</CardTitle>
          <CardDescription>Your progress and mastery level in each course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (masteryData.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Mastery</CardTitle>
        <CardDescription>Your progress and mastery level in each course</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {masteryData.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{course.course?.name}</h3>
                <span className="text-sm text-muted-foreground">{course.masteryLevel.toFixed(1)}% Mastery</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Topic Completion</span>
                  <span>{course.topicCompletionPercentage.toFixed(1)}%</span>
                </div>
                <Progress value={course.topicCompletionPercentage} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Quiz Average</span>
                  <span>{course.quizAverage.toFixed(1)}%</span>
                </div>
                <Progress
                  value={course.quizAverage}
                  indicatorColor={
                    course.quizAverage >= 90
                      ? "bg-success"
                      : course.quizAverage >= 75
                        ? "bg-primary"
                        : course.quizAverage >= 60
                          ? "bg-warning"
                          : "bg-destructive"
                  }
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>Assignment Average</span>
                  <span>{course.assignmentAverage.toFixed(1)}%</span>
                </div>
                <Progress
                  value={course.assignmentAverage}
                  indicatorColor={
                    course.assignmentAverage >= 90
                      ? "bg-success"
                      : course.assignmentAverage >= 75
                        ? "bg-primary"
                        : course.assignmentAverage >= 60
                          ? "bg-warning"
                          : "bg-destructive"
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
