"use client"

import { useState, useEffect } from "react"
import { Search, FileText, FileImage, FileVideo, FileArchive, File, Download, ExternalLink, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate, formatFileSize } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { lecturerService } from "@/lib/api-services"

interface TeachingMaterial {
  id: string
  title: string
  description: string
  fileType: string
  fileSize: number
  uploadDate: string
  courseId: string
  courseName: string
  topic: string
  downloadUrl: string
  viewUrl?: string
  downloadCount: number
  isPublic: boolean
}

export function TeachingMaterialsTable() {
  const [materials, setMaterials] = useState<TeachingMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user?.id) return

      try {
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const teachingMaterials = await lecturerService.getTeachingMaterials(lecturerProfile.id)
        setMaterials(teachingMaterials)
      } catch (error) {
        console.error("Failed to fetch materials:", error)
        toast({
          title: "Error",
          description: "Failed to load teaching materials",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [user, toast])

  // Get unique courses for filter dropdown
  const courses =
    materials.length > 0
      ? [...new Set(materials.map((material) => material.courseId))].map((id) => {
          const course = materials.find((m) => m.courseId === id)
          return { id, name: course?.courseName }
        })
      : []

  // Filter materials based on search term and filters
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.courseName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCourse = courseFilter === "all" || material.courseId === courseFilter

    const matchesType = typeFilter === "all" || material.fileType === typeFilter

    return matchesSearch && matchesCourse && matchesType
  })

  // Get unique file types for filter dropdown
  const fileTypes = materials.length > 0 ? [...new Set(materials.map((material) => material.fileType))] : []

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search materials..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="course-filter" className="whitespace-nowrap">
            Course:
          </Label>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger id="course-filter" className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="type-filter" className="whitespace-nowrap">
            File Type:
          </Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type-filter" className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {fileTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="flex h-[400px] w-full items-center justify-center rounded-md border border-dashed">
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-lg font-semibold">No materials found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or upload new teaching materials.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMaterials.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      )}
    </div>
  )
}

function MaterialCard({ material }: { material: TeachingMaterial }) {
  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="mt-1 text-primary">{getFileIcon(material.fileType)}</div>
            <div>
              <CardTitle className="text-base">{material.title}</CardTitle>
              <CardDescription className="text-xs">{material.courseName}</CardDescription>
            </div>
          </div>
          <Badge variant={material.isPublic ? "outline" : "secondary"}>
            {material.isPublic ? "Public" : "Private"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {material.description && <p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p>}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Topic: {material.topic}</span>
            <span>{material.fileType.toUpperCase()}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploaded: {formatDate(material.uploadDate)}</span>
            <span>{formatFileSize(material.fileSize)}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{material.downloadCount} downloads</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <Link href={`/materials/${material.id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          </Link>
          <Link href={material.downloadUrl}>
            <Button size="sm" variant="secondary">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download
            </Button>
          </Link>
        </div>
        {material.viewUrl && (
          <Link href={material.viewUrl} className="w-full">
            <Button size="sm" variant="default" className="w-full">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              View Online
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
