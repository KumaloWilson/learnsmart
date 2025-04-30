"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { File, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatFileSize } from "@/lib/utils"

// Mock material data
const mockMaterial = {
  id: "1",
  title: "Introduction to Programming Slides",
  description:
    "Comprehensive lecture slides covering basic programming concepts including variables, data types, operators, and control structures. These slides are designed for beginners with no prior programming experience.",
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
  allowDownload: true,
  tags: "lecture,slides,week1,introduction",
  fileName: "CS101_Intro_Programming_Slides.pdf",
}

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
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Please select a course"),
  topic: z.string().min(1, "Topic is required"),
  isPublic: z.boolean().default(true),
  allowDownload: z.boolean().default(true),
  tags: z.string().optional(),
})

export function MaterialEditForm({ id }) {
  const router = useRouter()
  const [material, setMaterial] = useState(null)
  const [courses, setCourses] = useState([])
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  // Fetch material and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, these would be fetch calls to your API
        // const materialResponse = await fetch(`/api/lecturer/materials/${id}`)
        // const materialData = await materialResponse.json()
        // const coursesResponse = await fetch("/api/lecturer/courses")
        // const coursesData = await coursesResponse.json()

        // Using mock data for now
        setTimeout(() => {
          setMaterial(mockMaterial)
          setCourses(mockCourses)

          // Set form values
          form.reset({
            title: mockMaterial.title,
            description: mockMaterial.description || "",
            courseId: mockMaterial.courseId,
            topic: mockMaterial.topic,
            isPublic: mockMaterial.isPublic,
            allowDownload: mockMaterial.allowDownload,
            tags: mockMaterial.tags || "",
          })

          // Set topics based on course
          setTopics(mockTopics[mockMaterial.courseId] || [])

          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [id, form])

  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType?.toLowerCase()) {
      case "pdf":
      case "docx":
      case "doc":
      case "txt":
        return <File className="h-6 w-6" />
      default:
        return <File className="h-6 w-6" />
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSaving(true)

      // In a real app, you would send data to API:
      // const res = await fetch(`/api/lecturer/materials/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // })
      // const data = await res.json()

      // Simulate API delay
      setTimeout(() => {
        setIsSaving(false)
        router.push(`/materials/${id}`)
      }, 1000)
    } catch (error) {
      console.error("Failed to update material:", error)
      setIsSaving(false)
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Material</CardTitle>
            <CardDescription>Update information for this teaching material</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea className="resize-none min-h-[100px]" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCourseId}>
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

            <div className="rounded-md border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(material.fileType)}
                  <div>
                    <p className="text-sm font-medium">{material.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {material.fileType.toUpperCase()} • {formatFileSize(material.fileSize)}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/materials/${id}/replace`)}
                >
                  Replace File
                </Button>
              </div>
            </div>

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
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push(`/materials/${id}`)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
