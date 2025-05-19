"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useStudentTopicProgress } from "@/lib/auth/hooks"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, Award, XCircle } from "lucide-react"

interface StudentTopicProgressProps {
  studentProfileId: string
  courseId: string
  semesterId: string
}

export function StudentTopicProgress({ studentProfileId, courseId, semesterId }: StudentTopicProgressProps) {
  const { studentProgress, loading, error, refetch } = useStudentTopicProgress(studentProfileId, courseId, semesterId)

  useEffect(() => {
    if (studentProfileId && courseId && semesterId) {
      // refetch()
    }
  }, [studentProfileId, courseId, semesterId, refetch])

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
          <CardTitle>Student Topic Progress</CardTitle>
          <CardDescription>Track this student's progress through course topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>Failed to load student topic progress. Please try again later.</p>
            <p className="text-sm text-destructive mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!studentProgress || !studentProgress.topics || studentProgress.topics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Topic Progress</CardTitle>
          <CardDescription>Track this student's progress through course topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>No topic progress data available for this student.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort topics by orderIndex
  const sortedTopics = [...studentProgress.topics].sort((a, b) => a.orderIndex - b.orderIndex)

  // Get progress for a specific topic
  const getTopicProgress = (topicId: string) => {
    return studentProgress.progress.find((p) => p.topicId === topicId)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Topic Progress</CardTitle>
        <CardDescription>Track this student's progress through course topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm font-medium">{studentProgress.completionPercentage}%</span>
          </div>
          <Progress value={studentProgress.completionPercentage} className="h-2" />
        </div>

        <div className="space-y-6">
          {sortedTopics.map((topic) => {
            const progress = getTopicProgress(topic.id)

            return (
              <div key={topic.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{topic.title}</h3>
                  {progress?.isCompleted ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-muted-foreground">
                      <XCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Not Completed</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Mastery Level</p>
                      <p className="font-medium">{progress ? `${progress.masteryLevel}%` : "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Time Spent</p>
                      <p className="font-medium">{progress ? `${progress.timeSpentMinutes} min` : "N/A"}</p>
                    </div>
                  </div>

                  {progress?.lastAccessedAt && (
                    <div className="flex items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Last Accessed</p>
                        <p className="font-medium">{new Date(progress.lastAccessedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>

                {progress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Mastery Level</span>
                      <span>{progress.masteryLevel}%</span>
                    </div>
                    <Progress value={progress.masteryLevel} className="h-2" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
