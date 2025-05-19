"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchRecommendations } from "@/features/ai-recommendations/redux/aiRecommendationsSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Video, FileText, BookOpen, Lightbulb } from "lucide-react"
import Link from "next/link"

export function AIRecommendationsPreview() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { recommendations, isLoading } = useAppSelector((state) => state.aiRecommendations)

  useEffect(() => {
    if (studentProfile?.id && accessToken && recommendations.length === 0) {
      dispatch(
        fetchRecommendations({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken, recommendations.length])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!recommendations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <CardDescription>No recommendations available at this time.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/ai-recommendations" className="flex items-center">
              <span>Generate Recommendations</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Get top 3 recommendations sorted by relevance score
  const topRecommendations = [...recommendations].sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3)

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "book":
        return <BookOpen className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Recommendations
        </CardTitle>
        <CardDescription>Personalized learning resources based on your performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="flex flex-col space-y-2 rounded-lg border p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getResourceIcon(recommendation.learningResource.type)}
                <span className="font-medium">{recommendation.learningResource.title}</span>
              </div>
              <Badge variant="outline" className="capitalize">
                {recommendation.learningResource.type}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {recommendation.learningResource.description}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Relevance: {(recommendation.relevanceScore * 100).toFixed(0)}%
              </div>
              <Button size="sm" variant="outline" asChild>
                <a
                  href={recommendation.learningResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <span>View Resource</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        ))}

        <Button asChild className="w-full">
          <Link href="/ai-recommendations" className="flex items-center justify-center">
            <span>View All Recommendations</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
