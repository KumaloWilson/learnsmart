"use client"

import { CardFooter } from "@/components/ui/card"

import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchRecommendations } from "@/features/ai-recommendations/redux/aiRecommendationsSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, BookOpen, Bookmark, CheckCircle, AlertTriangle } from "lucide-react"
import { RecommendationCard } from "@/features/ai-recommendations/components/recommendation-card"
import { RecommendationFilters } from "@/features/ai-recommendations/components/recommendation-filters"
import { GenerateRecommendations } from "@/features/ai-recommendations/components/generate-recommendations"
import type { Recommendation } from "@/features/ai-recommendations/types"

export function AIRecommendations() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { recommendations, isLoading, error } = useAppSelector((state) => state.aiRecommendations)
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([])

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      dispatch(
        fetchRecommendations({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken])

  useEffect(() => {
    setFilteredRecommendations(recommendations)
  }, [recommendations])

  if (isLoading || !studentProfile) {
    return <AIRecommendationsSkeletonLoader />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Group recommendations by status
  const allRecommendations = filteredRecommendations
  const savedRecommendations = filteredRecommendations.filter((rec) => rec.isSaved)
  const completedRecommendations = filteredRecommendations.filter((rec) => rec.isCompleted)

  // Group by course
  const courseRecommendations = filteredRecommendations.reduce(
    (acc, rec) => {
      const courseId = rec.course.id
      if (!acc[courseId]) {
        acc[courseId] = {
          courseId,
          courseName: rec.course.name,
          courseCode: rec.course.code,
          recommendations: [],
        }
      }
      acc[courseId].recommendations.push(rec)
      return acc
    },
    {} as Record<
      string,
      { courseId: string; courseName: string; courseCode: string; recommendations: Recommendation[] }
    >,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
        <p className="text-muted-foreground">Personalized learning recommendations powered by AI.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <RecommendationFilters recommendations={recommendations} onFilterChange={setFilteredRecommendations} />
          <div className="mt-6">
            <GenerateRecommendations />
          </div>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <span>All</span>
                <Badge variant="secondary" className="ml-1">
                  {allRecommendations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>By Course</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span>Saved</span>
                <Badge variant="secondary" className="ml-1">
                  {savedRecommendations.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Completed</span>
                <Badge variant="secondary" className="ml-1">
                  {completedRecommendations.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {allRecommendations.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Recommendations</CardTitle>
                    <CardDescription>
                      No recommendations available. Generate new recommendations to get started.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                allRecommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                ))
              )}
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              {Object.values(courseRecommendations).length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Recommendations</CardTitle>
                    <CardDescription>
                      No recommendations available. Generate new recommendations to get started.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                Object.values(courseRecommendations).map((course) => (
                  <div key={course.courseId} className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {course.courseName} ({course.courseCode})
                    </h3>
                    {course.recommendations.map((recommendation) => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              {savedRecommendations.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Saved Recommendations</CardTitle>
                    <CardDescription>
                      You haven't saved any recommendations yet. Save recommendations to access them later.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                savedRecommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completedRecommendations.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Completed Recommendations</CardTitle>
                    <CardDescription>
                      You haven't completed any recommendations yet. Mark recommendations as completed when you finish
                      them.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                completedRecommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function AIRecommendationsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </CardContent>
          </Card>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="md:col-span-2">
          <Skeleton className="h-10 w-full mb-6" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="mb-4">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-16" />
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-36" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
