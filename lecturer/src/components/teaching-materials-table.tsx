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

// Mock teaching materials data
const mockMaterials = [
  {
    id: "1",
    title: "Introduction to Programming Slides",
    description: "Lecture slides covering basic programming concepts",
    fileType: "pdf",
    fileSize: 2500000, // 2.5 MB
    uploadDate: "2025-04-15T10:30:00",
    courseId: "101",
    courseName: "CS101: Programming Fundamentals",
    topic: "Introduction to Programming",
    downloadUrl: "/api/materials/1/download",
    viewUrl: "/api/materials/1/view",
    downloadCount: 28,
    isPublic: true,
  },
  {
    id: "2",
    title: "Data Structures Handbook",
    description: "Comprehensive guide to common data structures",
    fileType: "pdf",
    fileSize: 5800000, // 5.8 MB
    uploadDate: "2025-04-10T14:20:00",
    courseId: "202",
    courseName: "CS202: Data Structures",
    topic: "Data Structures Overview",
    downloadUrl: "/api/materials/2/download",
    viewUrl: "/api/materials/2/view",
    downloadCount: 15,
    isPublic: true,
  },
  {
    id: "3",
    title: "Binary Search Trees - Code Examples",
    description: "Implementation examples of BST in various languages",
    fileType: "zip",
    fileSize: 1200000, // 1.2 MB
    uploadDate: "2025-04-12T09:15:00",
    courseId: "202",
    courseName: "CS202: Data Structures",
    topic: "Trees and Binary Search Trees",
    downloadUrl: "/api/materials/3/download",
    downloadCount: 22,
    isPublic: false,
  },
  {
    id: "4",
    title: "Neural Networks Visualization",
    description: "Interactive visualization of neural network architecture",
    fileType: "html",
    fileSize: 850000, // 850 KB
    uploadDate: "2025-04-18T16:45:00",
    courseId: "303",
    courseName: "CS303: Artificial Intelligence",
    topic: "Neural Networks",
    downloadUrl: "/api/materials/4/download",
    viewUrl: "/api/materials/4/view",
    downloadCount: 19,
    isPublic: true,
  },
  {
    id: "5",
    title: "Programming Fundamentals - Week 3 Recording",
    description: "Video recording of the lecture on control structures",
    fileType: "mp4",
    fileSize: 125000000, // 125 MB
    uploadDate: "2025-04-05T11:30:00",
    courseId: "101",
    courseName: "CS101: Programming Fundamentals",
    topic: "Control Structures",
    downloadUrl: "/api/materials/5/download",
    viewUrl: "/api/materials/5/view",
    downloadCount: 31,
    isPublic: true,
  },
  {
    id: "6",
    title: "AI Project Requirements",
    description: "Detailed requirements for the final project",
    fileType: "docx",
    fileSize: 450000, // 450 KB
    uploadDate: "2025-04-20T13:10:00",
    courseId: "303",
    courseName: "CS303: Artificial Intelligence",
    topic: "Course Project",
    downloadUrl: "/api/materials/6/download",
    viewUrl: "/api/materials/6/view",
    downloadCount: 25,
    isPublic: false,
  },
  {
    id: "7",
    title: "Programming Exercises - Week 4",
    description: "Practice problems on functions and arrays",
    fileType: "pdf",
    fileSize: 1800000, // 1.8 MB
    uploadDate: "2025-04-22T09:00:00",
    courseId: "101",
    courseName: "CS101: Programming Fundamentals",
    topic: "Functions and Arrays",
    downloadUrl: "/api/materials/7/download",
    viewUrl: "/api/materials/7/view",
    downloadCount: 18,
    isPublic: true,
  },
]

export function TeachingMaterialsTable() {
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    // Simulate API fetch
    const fetchMaterials = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        // const response = await fetch("/api/lecturer/materials")
        // const data = await response.json()

        // Using mock data for now
        setTimeout(() => {
          setMaterials(mockMaterials)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch materials:", error)
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [])

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

function MaterialCard({ material }) {
  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType) => {
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
