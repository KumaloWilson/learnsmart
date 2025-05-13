"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { markRecommendation, provideFeedback } from "@/lib/api/student-portal-api"
import { BookOpen, ThumbsUp, ThumbsDown, Bookmark, CheckCircle, ExternalLink } from "lucide-react"

interface RecommendationCardProps {
  recommendation: any
  onUpdate?: (id: string, action: string) => void
}

export function RecommendationCard({ recommendation, onUpdate }: RecommendationCardProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(recommendation.isSaved || false)
  const [isCompleted, setIsCompleted] = useState(recommendation.isCompleted || false)
  const [hasRated, setHasRated] = useState(recommendation.hasRated || false)
  const [isHelpful, setIsHelpful] = useState(recommendation.isHelpful)

  const handleAction = async (action: "view" | "save" | "complete") => {
    if (!user?.studentProfileId) return

    setIsLoading(true)
    try {
      await markRecommendation(recommendation.id, action)

      if (action === "save") {
        setIsSaved(true)
        toast({
          title: "Recommendation Saved",
          description: "This recommendation has been saved to your list.",
        })
      } else if (action === "complete") {
        setIsCompleted(true)
        toast({
          title: "Marked as Completed",
          description: "This recommendation has been marked as completed.",
        })
      }

      if (onUpdate) {
        onUpdate(recommendation.id, action)
      }
    } catch (error) {
      console.error(`Error marking recommendation as ${action}:`, error)
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: `Failed to mark recommendation as ${action}. Please try again.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (helpful: boolean) => {
    if (!user?.studentProfileId) return

    setIsLoading(true)
    try {
      await provideFeedback({
        recommendationId: recommendation.id,
        isHelpful: helpful,
      })

      setHasRated(true)
      setIsHelpful(helpful)
      toast({
        title: "Feedback Recorded",
        description: "Thank you for your feedback!",
      })

      if (onUpdate) {
        onUpdate(recommendation.id, "feedback")
      }
    } catch (error) {
      console.error("Error providing feedback:", error)
      toast({
        variant: "destructive",
        title: "Feedback Failed",
        description: "Failed to record your feedback. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={isCompleted ? "bg-muted/50" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{recommendation.title}</CardTitle>
            <CardDescription>{recommendation.course?.name}</CardDescription>
          </div>
          <Badge variant={getRecommendationTypeBadge(recommendation.type)}>{recommendation.type}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{recommendation.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {recommendation.tags?.map((tag: string) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {recommendation.resource && (
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
              {getResourceIcon(recommendation.resource.type)}
            </div>
            <div>
              <p className="font-medium text-sm">{recommendation.resource.title}</p>
              <p className="text-xs text-muted-foreground">{recommendation.resource.type}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>Estimated time: {recommendation.estimatedMinutes} minutes</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2 w-full">
          {recommendation.resource?.url && (
            <Button
              className="flex-1"
              onClick={() => {
                handleAction("view")
                window.open(recommendation.resource.url, "_blank")
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Resource
            </Button>
          )}

          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="icon"
            onClick={() => handleAction("save")}
            disabled={isLoading || isSaved}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>

          <Button
            variant={isCompleted ? "secondary" : "outline"}
            size="icon"
            onClick={() => handleAction("complete")}
            disabled={isLoading || isCompleted}
          >
            <CheckCircle className={`h-4 w-4 ${isCompleted ? "fill-current" : ""}`} />
          </Button>
        </div>

        {!hasRated && !isCompleted && (
          <div className="flex items-center gap-2 w-full mt-2">
            <p className="text-sm text-muted-foreground">Was this helpful?</p>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleFeedback(true)}
              disabled={isLoading}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Yes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleFeedback(false)}
              disabled={isLoading}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              No
            </Button>
          </div>
        )}

        {hasRated && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
            {isHelpful ? (
              <>
                <ThumbsUp className="h-3 w-3" />
                <span>You found this helpful</span>
              </>
            ) : (
              <>
                <ThumbsDown className="h-3 w-3" />
                <span>You didn't find this helpful</span>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

function getRecommendationTypeBadge(type: string): "default" | "secondary" | "outline" {
  switch (type?.toLowerCase()) {
    case "practice":
      return "default"
    case "review":
      return "secondary"
    default:
      return "outline"
  }
}

function getResourceIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "video":
      return <BookOpen className="h-4 w-4 text-primary" />
    case "quiz":
      return <BookOpen className="h-4 w-4 text-primary" />
    case "document":
      return <BookOpen className="h-4 w-4 text-primary" />
    case "link":
      return <ExternalLink className="h-4 w-4 text-primary" />
    default:
      return <BookOpen className="h-4 w-4 text-primary" />
  }
}
