"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Video, FileImage, File, ExternalLink, Download } from "lucide-react"

interface CourseMaterialsProps {
  materials: any[]
  isLoading: boolean
}

export function CourseMaterials({ materials, isLoading }: CourseMaterialsProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!materials || materials.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Materials Available</CardTitle>
          <CardDescription>There are no learning materials available for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
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

  return (
    <div className="space-y-4">
      {materials.map((material) => (
        <Card key={material.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{material.title}</CardTitle>
                <CardDescription>{material.description}</CardDescription>
              </div>
              <Badge>{material.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getIcon(material.type)}
                <span className="text-sm text-muted-foreground">
                  {material.fileSize ? `${(material.fileSize / 1024 / 1024).toFixed(2)} MB` : "External Resource"}
                </span>
              </div>
              <div className="flex gap-2">
                {material.fileUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={material.fileUrl} download target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                )}
                <Button size="sm" asChild>
                  <Link href={`/materials/${material.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
