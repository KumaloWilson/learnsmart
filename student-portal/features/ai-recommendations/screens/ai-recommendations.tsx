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
import { Lightbulb, BookOpen, Bookmark, CheckCircle, AlertTriangle, Sparkles } from "lucide-react"
import { RecommendationCard } from "@/features/ai-recommendations/components/recommendation-card"
import { RecommendationFilters } from "@/features/ai-recommendations/components/recommendation-filters"
import { GenerateRecommendations } from "@/features/ai-recommendations/components/generate-recommendations"
import type { Recommendation } from "@/features/ai-recommendations/types"

export function AIRecommendations() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { recommendations, isLoading, error } = useAppSelector((state) => state.aiRecommendations)
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([])
  const [activeTab, setActiveTab] = useState("all")

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
console.log("allRecommendations", allRecommendations)


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
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
        </div>
        <p className="text-muted-foreground">Personalized learning recommendations powered by AI.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/50 pb-3">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <RecommendationFilters recommendations={recommendations} onFilterChange={setFilteredRecommendations} />
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <GenerateRecommendations />
          </div>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-sm">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <CardHeader className="bg-muted/50 pb-0 pt-4">
                <TabsList className="flex h-auto w-full bg-transparent p-0">
                  <TabsTrigger 
                    value="all"
                    className="flex-1 flex items-center justify-center gap-2 rounded-none border-r border-b-2 px-3 py-3 data-[state=active]:border-b-primary data-[state=active]:border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-none"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>All</span>
                    <Badge variant="secondary" className="ml-1">
                      {allRecommendations.length}
                    </Badge>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="courses"
                    className="flex-1 flex items-center justify-center gap-2 rounded-none border-r border-b-2 px-3 py-3 data-[state=active]:border-b-primary data-[state=active]:border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-none"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>By Course</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="saved"
                    className="flex-1 flex items-center justify-center gap-2 rounded-none border-r border-b-2 px-3 py-3 data-[state=active]:border-b-primary data-[state=active]:border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-none"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Saved</span>
                    <Badge variant="secondary" className="ml-1">
                      {savedRecommendations.length}
                    </Badge>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="completed"
                    className="flex-1 flex items-center justify-center gap-2 rounded-none border-b-2 px-3 py-3 data-[state=active]:border-b-primary data-[state=active]:border-b-2 data-[state=active]:bg-background data-[state=active]:shadow-none"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Completed</span>
                    <Badge variant="secondary" className="ml-1">
                      {completedRecommendations.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
              
              <CardContent className="pt-6">
                <TabsContent value="all" className="mt-0 space-y-4">
                  {allRecommendations.length === 0 ? (
                    <Card className="border-dashed">
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

                <TabsContent value="courses" className="mt-0 space-y-6">
                  {Object.values(courseRecommendations).length === 0 ? (
                    <Card className="border-dashed">
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
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <h3 className="text-lg font-semibold">
                            {course.courseName} <Badge variant="outline">{course.courseCode}</Badge>
                          </h3>
                        </div>
                        {course.recommendations.map((recommendation) => (
                          <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                        ))}
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="saved" className="mt-0 space-y-4">
                  {savedRecommendations.length === 0 ? (
                    <Card className="border-dashed">
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

                <TabsContent value="completed" className="mt-0 space-y-4">
                  {completedRecommendations.length === 0 ? (
                    <Card className="border-dashed">
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
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AIRecommendationsSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="bg-muted/50 pb-3">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
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
            <Card>
              <CardHeader className="bg-muted/50 pb-0 pt-4">
                <div className="flex w-full">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="flex-1 h-12 rounded-none" />
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}