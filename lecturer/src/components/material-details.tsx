"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Tag,
  Users,
  BarChart2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDateTime, formatFileSize } from "@/lib/utils"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock material data
const mockMaterial = {
  id: "1",
  title: "Introduction to Programming Slides",
  description:
    "Comprehensive lecture slides covering basic programming concepts including variables, data types, operators, and control structures. These slides are designed for beginners with no prior programming experience.",
  fileType: "pdf",
  fileSize: 2500000, // 2.5 MB
  uploadDate: "2025-04-15T10:30:00",
  lastUpdated: "2025-04-16T14:20:00",
  courseId: "101",
  courseName: "CS101: Programming Fundamentals",
  topic: "Introduction to Programming",
  downloadUrl: "/api/materials/1/download",
  viewUrl: "/api/materials/1/view",
  downloadCount: 28,
  viewCount: 45,
  isPublic: true,
  allowDownload: true,
  tags: ["lecture", "slides", "week1", "introduction"],
  uploadedBy: "Dr. Jane Smith",
  fileName: "CS101_Intro_Programming_Slides.pdf",
  analytics: {
    weeklyViews: [5, 12, 8, 15, 5],
    weeklyDownloads: [3, 8, 5, 10, 2],
    topStudents: [
      { id: "s1", name: "Alice Johnson", views: 5, downloads: 2 },
      { id: "s2", name: "Bob Williams", views: 4, downloads: 1 },
      { id: "s3", name: "Charlie Brown", views: 3, downloads: 1 },
    ],
  },
}

export function MaterialDetails({ id }) {
  const router = useRouter()
  const [material, setMaterial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate API fetch
    const fetchMaterial = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        // const response = await fetch(`/api/lecturer/materials/${id}`)
        // const data = await response.json()

        // Using mock data for now
        setTimeout(() => {
          setMaterial(mockMaterial)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch material:", error)
        setLoading(false)
      }
    }

    fetchMaterial()
  }, [id])

  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
      case "docx":
      case "doc":
      case "txt":
        return <FileText className="h-6 w-6" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileImage className="h-6 w-6" />
      case "mp4":
      case "mov":
      case "avi":
        return <FileVideo className="h-6 w-6" />
      case "zip":
      case "rar":
        return <FileArchive className="h-6 w-6" />
      default:
        return <File className="h-6 w-6" />
    }
  }

  const handleDelete = async () => {
    try {
      // In a real app, this would be a fetch call to your API
      // await fetch(`/api/lecturer/materials/${id}`, {
      //   method: "DELETE",
      // })

      // Simulate API delay
      setTimeout(() => {
        router.push("/materials")
      }, 500)
    } catch (error) {
      console.error("Failed to delete material:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <Skeleton className="h-6 w-64" />
                <Skeleton className="mt-2 h-4 w-40" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!material) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
        <div className="flex flex-col items-center gap-2 text-center">
          <h3 className="text-lg font-semibold">Material not found</h3>
          <p className="text-sm text-muted-foreground">The requested teaching material could not be found.</p>
          <Button onClick={() => router.push("/materials")}>Back to Materials</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex items-start gap-3">
              <div className="mt-1 text-primary">{getFileIcon(material.fileType)}</div>
              <div>
                <CardTitle>{material.title}</CardTitle>
                <CardDescription>
                  {material.courseName} • {material.topic}
                </CardDescription>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={material.isPublic ? "outline" : "secondary"}>
                {material.isPublic ? "Public" : "Private"}
              </Badge>
              {material.allowDownload && <Badge variant="outline">Downloadable</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {material.description && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{material.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">File Information</h3>
              <div className="rounded-md border p-4">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="text-primary">{getFileIcon(material.fileType)}</div>
                  <div>
                    <p className="text-sm font-medium">{material.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {material.fileType.toUpperCase()} • {formatFileSize(material.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Uploaded: {formatDateTime(material.uploadDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last updated: {formatDateTime(material.lastUpdated)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Uploaded by: {material.uploadedBy}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Usage Statistics</h3>
              <div className="rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-4">
                    <p className="text-2xl font-bold">{material.viewCount}</p>
                    <p className="text-xs text-muted-foreground">Total Views</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-4">
                    <p className="text-2xl font-bold">{material.downloadCount}</p>
                    <p className="text-xs text-muted-foreground">Total Downloads</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>Last viewed: 2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4 text-muted-foreground" />
                    <span>Last downloaded: Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {material.tags && material.tags.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {material.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Tabs defaultValue="actions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="actions">Actions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="actions" className="mt-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
                {material.viewUrl && (
                  <Link href={material.viewUrl} target="_blank" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View Online
                    </Button>
                  </Link>
                )}
                {material.downloadUrl && (
                  <Link href={material.downloadUrl} className="w-full">
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </Link>
                )}
                <Link href={`/materials/${material.id}/edit`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this teaching material. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Weekly Activity</h4>
                  <div className="h-[200px] rounded-md border p-4">
                    <div className="flex h-full items-center justify-center">
                      <BarChart2 className="h-16 w-16 text-muted-foreground" />
                      <p className="ml-2 text-sm text-muted-foreground">Analytics visualization would appear here</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-medium">Top Students</h4>
                  <div className="rounded-md border">
                    <div className="p-4">
                      {material.analytics.topStudents.length > 0 ? (
                        <div className="divide-y">
                          {material.analytics.topStudents.map((student) => (
                            <div key={student.id} className="flex items-center justify-between py-2">
                              <span className="text-sm">{student.name}</span>
                              <div className="text-sm">
                                <span className="mr-4">{student.views} views</span>
                                <span>{student.downloads} downloads</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm text-muted-foreground">No student data available</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardFooter>
      </Card>
    </div>
  )
}
