"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import {
  FileText,
  Video,
  FileIcon as FilePresentation,
  FileAudio,
  LinkIcon,
  Download,
  ExternalLink,
  Eye,
} from "lucide-react"

type Material = {
  id: string
  title: string
  description: string
  type: string
  fileUrl?: string
  externalUrl?: string
  uploadedAt: string
  course: {
    id: string
    name: string
  }
  fileSize?: number
  fileType?: string
  thumbnailUrl?: string
}

type MaterialsListProps = {
  materials: Material[]
  emptyMessage?: string
}

export function MaterialsList({ materials, emptyMessage = "No materials found." }: MaterialsListProps) {
  if (!materials.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FileText className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No materials found</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  )
}

function MaterialCard({ material }: { material: Material }) {
  const typeColors: Record<string, string> = {
    document: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    video: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    presentation: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    audio: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    link: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  }

  const getTypeIcon = () => {
    switch (material.type) {
      case "document":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "presentation":
        return <FilePresentation className="h-5 w-5" />
      case "audio":
        return <FileAudio className="h-5 w-5" />
      case "link":
        return <LinkIcon className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size"
    const units = ["B", "KB", "MB", "GB"]
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{material.title}</CardTitle>
          <Badge className={typeColors[material.type] || typeColors.other}>
            {material.type.charAt(0).toUpperCase() + material.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{material.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-muted-foreground">
            {getTypeIcon()}
            <span className="ml-2">
              {material.fileType || material.type.charAt(0).toUpperCase() + material.type.slice(1)}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Uploaded: {format(new Date(material.uploadedAt), "MMM d, yyyy")}</span>
          </div>
        </div>

        {material.fileSize && (
          <div className="mt-2 text-sm text-muted-foreground">File size: {formatFileSize(material.fileSize)}</div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">{material.course.name}</div>

        <div className="flex space-x-2">
          {material.type === "link" && material.externalUrl ? (
            <Button variant="outline" asChild>
              <a href={material.externalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </a>
            </Button>
          ) : material.fileUrl ? (
            <>
              <Button variant="outline" asChild>
                <Link href={`/materials/${material.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href={material.fileUrl} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link href={`/materials/${material.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
