"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, BookOpen, Download, FileText, LinkIcon, MoreHorizontal, Plus, Video } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { authService, lecturerService } from "@/lib/api-services"

interface CourseMaterialsProps {
  courseId: string
}

interface Material {
  id: string
  title: string
  description: string
  type: "document" | "video" | "link" | "presentation" | "other"
  url: string
  fileSize?: number
  uploadDate: string
  views: number
  downloads?: number
  isPublished: boolean
}

export function CourseMaterials({ courseId }: CourseMaterialsProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true)
        const user = authService.getCurrentUser()
        if (!user) throw new Error("User not authenticated")

        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const materialsData = await lecturerService.getCourseMaterials(courseId, lecturerProfile.id)
        setMaterials(materialsData)
      } catch (err) {
        console.error("Failed to fetch materials:", err)
        setError("Failed to load teaching materials. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [courseId])

  const getMaterialTypeBadge = (type: string) => {
    switch (type) {
      case "document":
        return (
          <Badge className="bg-blue-500">
            <FileText className="mr-1 h-3 w-3" />
            Document
          </Badge>
        )
      case "video":
        return (
          <Badge className="bg-red-500">
            <Video className="mr-1 h-3 w-3" />
            Video
          </Badge>
        )
      case "link":
        return (
          <Badge className="bg-green-500">
            <LinkIcon className="mr-1 h-3 w-3" />
            Link
          </Badge>
        )
      case "presentation":
        return (
          <Badge className="bg-amber-500">
            <BookOpen className="mr-1 h-3 w-3" />
            Presentation
          </Badge>
        )
      default:
        return <Badge>{type}</Badge>
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A"
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  const handleDeleteMaterial = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await lecturerService.deleteTeachingMaterial(id)
        setMaterials(materials.filter((material) => material.id !== id))
      } catch (err) {
        console.error("Failed to delete material:", err)
        alert("Failed to delete material. Please try again.")
      }
    }
  }

  const togglePublishStatus = async (id: string, currentStatus: boolean) => {
    try {
      const material = materials.find((m) => m.id === id)
      if (!material) return

      await lecturerService.updateTeachingMaterial(id, {
        ...material,
        isPublished: !currentStatus,
      })

      setMaterials(materials.map((m) => (m.id === id ? { ...m, isPublished: !currentStatus } : m)))
    } catch (err) {
      console.error("Failed to update material status:", err)
      alert("Failed to update material status. Please try again.")
    }
  }

  if (loading) {
    return <CourseMaterialsSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Teaching Materials</CardTitle>
          <CardDescription>Documents, videos, and resources for this course</CardDescription>
        </div>
        <Link href={`/materials/new?courseId=${courseId}`} passHref>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No materials found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no teaching materials uploaded for this course yet.
            </p>
            <Link href={`/materials/new?courseId=${courseId}`} passHref>
              <Button className="mt-4" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[300px] truncate">{material.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{material.description}</div>
                    </TableCell>
                    <TableCell>{getMaterialTypeBadge(material.type)}</TableCell>
                    <TableCell>{new Date(material.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell>{formatFileSize(material.fileSize)}</TableCell>
                    <TableCell>{material.views}</TableCell>
                    <TableCell>
                      <Badge variant={material.isPublished ? "default" : "outline"}>
                        {material.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/materials/${material.id}`} className="flex w-full">
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/materials/${material.id}/edit`} className="flex w-full">
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <a href={material.url} target="_blank" rel="noopener noreferrer" className="flex w-full">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => togglePublishStatus(material.id, material.isPublished)}>
                            {material.isPublished ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMaterial(material.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CourseMaterialsSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/3 mt-1" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
