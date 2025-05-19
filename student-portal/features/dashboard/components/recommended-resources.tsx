import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Video, FileText, BookOpen, HelpCircle } from "lucide-react"
import type { LearningRecommendation } from "@/features/auth/types"

interface RecommendedResourcesProps {
  recommendations: LearningRecommendation[]
}

export function RecommendedResources({ recommendations }: RecommendedResourcesProps) {
  if (!recommendations.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Resources</CardTitle>
          <CardDescription>No recommendations available at this time.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Recommended Learning Resources</CardTitle>
        <CardDescription>Personalized resources based on your learning patterns and course progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((resource) => (
            <div key={resource.id} className="flex flex-col space-y-2 rounded-lg border p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getResourceIcon(resource.resourceType)}
                  <span className="font-medium">{resource.resourceTitle}</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {resource.resourceType}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                For: {resource.courseName} ({resource.courseCode})
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Relevance: {(resource.relevanceScore * 100).toFixed(0)}%
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={resource.resourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <span>View Resource</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
