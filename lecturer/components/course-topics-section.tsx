"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useCourseTopics, useTopicProgressStatistics } from "@/lib/auth/hooks"
import { useRouter } from "next/navigation"
import { BookOpen, Clock, Award, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface CourseTopicsSectionProps {
  courseId: string
  semesterId: string
}

export function CourseTopicsSection({ courseId, semesterId }: CourseTopicsSectionProps) {
  const router = useRouter()
  // Added state to track if data fetching has been attempted
  const [hasFetched, setHasFetched] = useState(false)
  
  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
    refetch: refetchTopics,
  } = useCourseTopics(courseId, semesterId)
  
  const {
    progressStats,
    loading: progressLoading,
    refetch: refetchProgress,
  } = useTopicProgressStatistics(courseId, semesterId)

  useEffect(() => {
    // Guard against empty strings or undefined values
    if (!courseId || !semesterId || hasFetched) return;

    const fetchData = async () => {
      try {
        await Promise.all([
          refetchTopics(),
          refetchProgress()
        ]);
        setHasFetched(true);
      } catch (err) {
        console.error("Error fetching data:", err);
        setHasFetched(true); // Mark as fetched even on error to prevent infinite loops
      }
    };

    fetchData();
  }, [courseId, semesterId, refetchTopics, refetchProgress, hasFetched]);

  const loading = topicsLoading || progressLoading;

  if (loading && !hasFetched) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Added error handling for both data sources
  if (topicsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Topics</CardTitle>
          <CardDescription>View and manage topics for this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>Failed to load course topics. Please try again later.</p>
            <Button onClick={() => {
              setHasFetched(false);
              refetchTopics();
              refetchProgress();
            }} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!topics || topics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Topics</CardTitle>
          <CardDescription>View and manage topics for this course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-muted-foreground">
            <p>No topics have been created for this course yet.</p>
            <Button onClick={() => router.push(`/courses/${courseId}/topics/create`)} className="mt-4">
              Create First Topic
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort topics by orderIndex
  const sortedTopics = [...topics].sort((a, b) => a.orderIndex - b.orderIndex)

  // Get progress data for each topic
  const getTopicProgress = (topicId: string) => {
    if (!progressStats) return null
    return progressStats.find((stat) => stat.topicId === topicId)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Topics</CardTitle>
          <CardDescription>View and manage topics for this course</CardDescription>
        </div>
        <Button variant="outline" onClick={() => router.push(`/courses/${courseId}/topics`)}>
          View All Topics
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTopics.slice(0, 3).map((topic) => {
            const progress = getTopicProgress(topic.id)

            return (
              <div key={topic.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{topic.title}</h3>
                      <Badge variant={topic.isActive ? "default" : "secondary"}>
                        {topic.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{topic.difficulty}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
                    <div className="flex flex-wrap gap-2 items-center text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{topic.durationHours} hours</span>
                      </div>
                      {progress && (
                        <>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{Math.round(progress.completionRate * 100)}% completion</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{Math.round(progress.averageMasteryLevel * 100)}% mastery</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => router.push(`/courses/${courseId}/topics/${topic.id}`)}
                  >
                    <span className="sr-md:inline">Details</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                {progress && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Completion</span>
                      <span>{Math.round(progress.completionRate * 100)}%</span>
                    </div>
                    <Progress value={progress.completionRate * 100} className="h-2" />
                  </div>
                )}
              </div>
            )
          })}

          {sortedTopics.length > 3 && (
            <div className="text-center pt-2">
              <Button variant="link" onClick={() => router.push(`/courses/${courseId}/topics`)}>
                View all {sortedTopics.length} topics
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}