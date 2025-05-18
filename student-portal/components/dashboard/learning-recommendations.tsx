"use client"

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { updateLearningRecommendation } from "@/lib/redux/slices/studentSlice"
import { useUpdateRecommendationMutation } from "@/lib/api/student"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, Video } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export function LearningRecommendations() {
  const { profile, isLoading } = useAppSelector((state) => state.student)
  const dispatch = useAppDispatch()
  const [updateRecommendation] = useUpdateRecommendationMutation()

  if (isLoading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48 mb-1" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div>
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile || !profile.learningRecommendations.length) return null

  // Only show top 3 recommendations
  const topRecommendations = [...profile.learningRecommendations]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)

  const handleMarkAsViewed = async (id: string) => {
    try {
      // Optimistically update the UI
      dispatch(
        updateLearningRecommendation({
          id,
          updates: { isViewed: true },
        }),
      )

      // Update on the server
      await updateRecommendation({
        id,
        updates: { isViewed: true },
      }).unwrap()
    } catch (error) {
      console.error("Failed to update recommendation:", error)
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recommended Resources</CardTitle>
        <CardDescription>Personalized for your current courses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="flex flex-col space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 p-1 rounded-md bg-blue-100">
                    {getResourceIcon(recommendation.resourceType)}
                  </div>
                  <div>
                    <p className="font-medium">{recommendation.resourceTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {recommendation.courseName} • {recommendation.resourceType}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {Math.round(recommendation.relevanceScore * 100)}% match
                </Badge>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant={recommendation.isViewed ? "outline" : "default"}
                  onClick={() => {
                    window.open(recommendation.resourceUrl, "_blank")
                    if (!recommendation.isViewed) {
                      handleMarkAsViewed(recommendation.id)
                    }
                  }}
                >
                  {recommendation.isViewed ? "View Again" : "View Resource"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
