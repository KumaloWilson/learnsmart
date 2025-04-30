"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { File, X, Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

// Mock courses data
const mockCourses = [
  { id: "101", name: "CS101: Programming Fundamentals", semester: "Spring 2025" },
  { id: "202", name: "CS202: Data Structures", semester: "Spring 2025" },
  { id: "303", name: "CS303: Artificial Intelligence", semester: "Spring 2025" },
]

// Mock topics data
const mockTopics = {
  "101": [
    "Introduction to Programming",
    "Variables and Data Types",
    "Control Structures",
    "Functions and Arrays",
    "Object-Oriented Programming",
  ],
  "202": [
    "Data Structures Overview",
    "Arrays and Linked Lists",
    "Stacks and Queues",
    "Trees and Binary Search Trees",
    "Graphs and Graph Algorithms",
  ],
  "303": [
    "Introduction to AI",
    "Search Algorithms",
    "Knowledge Representation",
    "Machine Learning",
    "Neural Networks",
    "Natural Language Processing",
    "Course Project",
  ],
}

// Form schema
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
]

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Please select a course"),
  topic: z.string().min(1, "Topic is required"),
  file: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `File size must be less than 100MB`)
    .refine(
      (file) =>
        !file || ACCEPTED_FILE_TYPES.includes(file.type) || file.name.endsWith(".pptx") || file.name.endsWith(".xlsx"),
      "Unsupported file format",
    ),
  isPublic: z.boolean().default(true),
  allowDownload: z.boolean().default(true),
  tags: z.string().optional(),
})

export function MaterialUploadForm({ material = null }) {
  const router = useRouter()
  const [courses, setCourses] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: material || {
      title: "",
      description: "",
      courseId: "",
      topic: "",
      isPublic: true,
      allowDownload: true,
      tags: "",
    },
  })

  // Watch for course changes to update topics
  const selectedCourseId = form.watch("courseId")

  useEffect(() => {
    if (selectedCourseId) {
      setTopics(mockTopics[selectedCourseId] || [])
    } else {
      setTopics([])
    }
  }, [selectedCourseId])

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real app, this would be a fetch call to your API
        // const response = await fetch("/api/lecturer/courses")
        // const data = await response.json()

        // Using mock data for now
        setTimeout(() => {
          setCourses(mockCourses)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch courses:", error)
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      form.setValue("file", file)
    }
  }

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null)
    form.setValue("file", undefined)
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUploading(true)

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      // In a real app, you would use FormData to upload the file:
      // const formData = new FormData()
      // formData.append("title", values.title)
      // formData.append("description", values.description || "")
      // formData.append("courseId", values.courseId)
      // formData.append("topic", values.topic)
      // formData.append("isPublic", String(values.isPublic))
      // formData.append("allowDownload", String(values.allowDownload))
      // formData.append("tags", values.tags || "")
      // formData.append("file", values.file)
      //
      // const res = await fetch("/api/lecturer/materials", {
      //   method: "POST",
      //   body: formData,
      // })
      // const data = await res.json()

      // Simulate API delay
      setTimeout(() => {
        clearInterval(interval)
        setUploadProgress(100)

        setTimeout(() => {
          setIsUploading(false)
          router.push("/materials")
        }, 500)
      }, 2000)
    } catch (error) {
      console.error("Failed to upload material:", error)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Material Details</CardTitle>
            <CardDescription>Enter information about the teaching material</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Introduction to Programming Slides" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of the material content"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCourseId}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedCourseId ? "Select a topic" : "Select a course first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {!selectedFile ? (
                        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                          <div className="flex flex-col items-center space-y-2 text-center">
                            <File className="h-8 w-8 text-muted-foreground" />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                              <p className="text-xs text-muted-foreground">
                                Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, ZIP, RAR, JPG, PNG, GIF,
                                MP4
                              </p>
                              <p className="text-xs text-muted-foreground">Maximum file size: 100MB</p>
                            </div>
                            <Input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                              {...rest}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("file-upload")?.click()}
                            >
                              Browse Files
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-md border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <File className="h-6 w-6 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(selectedFile.size)} • {selectedFile.type || "Unknown type"}
                                </p>
                              </div>
                            </div>
                            <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove file</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. lecture, slides, week1 (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>Add tags to help students find this material</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make Public</FormLabel>
                      <FormDescription>Allow all students in the course to access this material</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowDownload"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allow Downloads</FormLabel>
                      <FormDescription>Let students download this material to their devices</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {isUploading && (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 w-full" />
              </div>
            )}
            <div className="flex w-full justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/materials")} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Uploading...
                  </>
                ) : uploadProgress === 100 ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Uploaded
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Material
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
