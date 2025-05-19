"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  markRecommendationAsViewed,
  markRecommendationAsCompleted,
  saveRecommendation,
  rateRecommendation,
} from "@/features/ai-recommendations/redux/aiRecommendationsSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  ExternalLink,
  Video,
  FileText,
  BookOpen,
  Clock,
  Tag,
  Star,
  CheckCircle,
  Bookmark,
  BookmarkCheck,
} from "lucide-react"
import type { Recommendation } from "@/features/ai-recommendations/types"

interface RecommendationCardProps {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { toast } = useToast()
  const [rating, setRating] = useState<number | null>(recommendation.rating)
  const [feedback, setFeedback] = useState<string | null>(recommendation.feedback)
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false)

  const { learningResource, reason, relevanceScore, isViewed, isSaved, isCompleted } = recommendation

  const handleViewResource = () => {
    if (!studentProfile?.id || !accessToken) return

    // Open the resource in a new tab
    window.open(learningResource.url, "_blank")

    // Mark as viewed if not already
    if (!isViewed) {
      dispatch(
        markRecommendationAsViewed({
          studentProfileId: studentProfile.id,
          recommendationId: recommendation.id,
          token: accessToken,
        }),
      )
      toast({
        title: "Resource Viewed",
        description: "This resource has been marked as viewed",
      })
    }
  }

  const handleSaveResource = () => {
    if (!studentProfile?.id || !accessToken) return

    dispatch(
      saveRecommendation({
        studentProfileId: studentProfile.id,
        recommendationId: recommendation.id,
        token: accessToken,
      }),
    )
    toast({
      title: isSaved ? "Already Saved" : "Resource Saved",
      description: isSaved ? "This resource is already in your saved items" : "This resource has been saved for later",
    })
  }

  const handleMarkAsCompleted = () => {
    if (!studentProfile?.id || !accessToken) return

    dispatch(
      markRecommendationAsCompleted({
        studentProfileId: studentProfile.id,
        recommendationId: recommendation.id,
        token: accessToken,
      }),
    )
    toast({
      title: "Marked as Completed",
      description: "This resource has been marked as completed",
    })
  }

  const handleSubmitRating = () => {
    if (!studentProfile?.id || !accessToken || rating === null) return

    dispatch(
      rateRecommendation({
        studentProfileId: studentProfile.id,
        recommendationId: recommendation.id,
        rating,
        feedback,
        token: accessToken,
      }),
    )
    setIsRatingDialogOpen(false)
    toast({
      title: "Rating Submitted",
      description: "Thank you for rating this resource",
    })
  }

  const getResourceIcon = () => {
    switch (learningResource.type) {
      case "video":
        return <Video className="h-5 w-5 text-primary" />
      case "article":
        return <FileText className="h-5 w-5 text-primary" />
      case "book":
        return <BookOpen className="h-5 w-5 text-primary" />
      default:
        return <FileText className="h-5 w-5 text-primary" />
    }
  }

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1:
        return "Beginner"
      case 2:
        return "Intermediate"
      case 3:
        return "Advanced"
      case 4:
        return "Expert"
      default:
        return "All Levels"
    }
  }

  return (
    <Card className={isCompleted ? "border-green-200 bg-green-50" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            {getResourceIcon()}
            <div>
              <CardTitle className="text-lg">{learningResource.title}</CardTitle>
              <CardDescription>{learningResource.description}</CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="capitalize">
              {learningResource.type}
            </Badge>
            {isCompleted && (
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                <CheckCircle className="mr-1 h-3 w-3" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{learningResource.durationMinutes} minutes</span>
          </div>
          <div className="flex items-center">
            <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Difficulty: {getDifficultyLabel(learningResource.difficulty)}</span>
          </div>
          <div className="flex items-center">
            <Star className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Relevance: {(relevanceScore * 100).toFixed(0)}%</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1">Why this is recommended:</h4>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>

        {learningResource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {learningResource.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          By {learningResource.metadata.author} • Published{" "}
          {new Date(learningResource.metadata.publishedDate).toLocaleDateString()}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveResource}
            disabled={isSaved}
            className={isSaved ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
          >
            {isSaved ? <BookmarkCheck className="mr-1 h-4 w-4" /> : <Bookmark className="mr-1 h-4 w-4" />}
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAsCompleted}
            disabled={isCompleted}
            className={isCompleted ? "bg-green-50 text-green-700 border-green-200" : ""}
          >
            <CheckCircle className="mr-1 h-4 w-4" />
            {isCompleted ? "Completed" : "Mark as Completed"}
          </Button>
        </div>
        <div className="flex gap-2">
          <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={rating !== null}>
                <Star className="mr-1 h-4 w-4" />
                {rating !== null ? `Rated ${rating}/5` : "Rate"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rate this resource</DialogTitle>
                <DialogDescription>How helpful was "{learningResource.title}" for your learning?</DialogDescription>
              </DialogHeader>
              <div className="flex justify-center py-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      variant={rating === value ? "default" : "outline"}
                      size="sm"
                      className="h-10 w-10 rounded-full p-0"
                      onClick={() => setRating(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
              </div>
              <Textarea
                placeholder="Share your feedback about this resource (optional)"
                value={feedback || ""}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px]"
              />
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsRatingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitRating} disabled={rating === null}>
                  Submit Rating
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button onClick={handleViewResource}>
            <ExternalLink className="mr-1 h-4 w-4" />
            View Resource
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
