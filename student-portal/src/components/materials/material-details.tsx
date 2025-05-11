"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { recordMaterialInteraction } from "@/lib/api/materials-api"
import { FileText, Video, FileImage, File, ExternalLink, Download, ThumbsUp, ThumbsDown, BookOpen } from "lucide-react"

interface MaterialDetailsProps {
  material: any
}

export function MaterialDetails({ material }: MaterialDetailsProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(material.progress || 0)
  const [hasRated, setHasRated] = useState(false)

  const handleRecordInteraction = async (interactionType: string, rating?: number) => {
    if (!user?.studentProfileId) return

    setIsLoading(true)
    try {
      await recordMaterialInteraction({
        materialId: material.id,
        studentProfileId: user.studentProfileId,
        interactionType,
        rating,
      })

      if (interactionType === "view") {
        // Update progress
        setProgress((prev) => Math.min(100, prev + 25))
      }

      if (rating !== undefined) {
        setHasRated(true)
        toast({
          title: "Feedback Recorded",
          description: "Thank you for your feedback!",
        })
      }
    } catch (error) {
      console.error("Error recording interaction:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    // Record download interaction
    handleRecordInteraction("download")

    // Trigger download
    if (material.fileUrl) {
      window.open(material.fileUrl, "_blank")
    }
  }

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "image":
        return <FileImage className="h-5 w-5" />
      case "link":
        return <ExternalLink className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  // Record view interaction on component mount
  useState(() => {
    handleRecordInteraction("view")
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{material.title}</CardTitle>
              <CardDescription>{material.course?.name}</CardDescription>
            </div>
            <Badge>{material.type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none dark:prose-invert">
            <p>{material.description}</p>
          </div>

          <div className="flex items-center gap-2">
            {getIcon(material.type)}
            <span className="text-sm text-muted-foreground">
              {material.fileSize ? `${(material.fileSize / 1024 / 1024).toFixed(2)} MB` : "External Resource"}
            </span>
          </div>

          <div className="mt-6">
            {material.type === "pdf" && material.fileUrl && (
              <div className="border rounded-md overflow-hidden h-[600px]">
                <iframe
                  src={`${material.fileUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full"
                  title={material.title}
                />
              </div>
            )}

            {material.type === "video" && material.fileUrl && (
              <div className="aspect-video">
                <video
                  src={material.fileUrl}
                  controls
                  className="w-full h-full rounded-md"
                  onPlay={() => handleRecordInteraction("play")}
                  onPause={() => handleRecordInteraction("pause")}
                  onEnded={() => {
                    handleRecordInteraction("complete")
                    setProgress(100)
                  }}
                />
              </div>
            )}

            {material.type === "image" && material.fileUrl && (
              <div className="flex justify-center">
                <img
                  src={material.fileUrl || "/placeholder.svg"}
                  alt={material.title}
                  className="max-w-full max-h-[600px] rounded-md"
                />
              </div>
            )}

            {material.type === "link" && material.externalUrl && (
              <Button asChild className="w-full">
                <a
                  href={material.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleRecordInteraction("click")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open External Resource
                </a>
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {material.fileUrl && (
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}

            <Button variant="outline" asChild>
              <a href={`/courses/${material.courseId}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Back to Course
              </a>
            </Button>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Was this material helpful?</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleRecordInteraction("rate", 1)}
                disabled={hasRated || isLoading}
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Yes, it was helpful
              </Button>
              <Button
                variant="outline"
                onClick={() => handleRecordInteraction("rate", 0)}
                disabled={hasRated || isLoading}
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                No, needs improvement
              </Button>
            </div>
            {hasRated && <p className="text-sm text-muted-foreground mt-2">Thank you for your feedback!</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
