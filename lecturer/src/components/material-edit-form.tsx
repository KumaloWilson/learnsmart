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
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { lecturerService } from "@/lib/api-services"

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

export function MaterialEditForm({ id }: { id: string }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
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
      // Fetch topics for the selected course
      const fetchTopics = async () => {
        try {
          const courseTopics = await lecturerService.getCourseTopics(selectedCourseId)
          setTopics(courseTopics)
        } catch (error) {
          console.error("Failed to fetch topics:", error)
          toast({
            title: "Error",
            description: "Failed to load course topics",
            variant: "destructive",
          })
        }
      }

      fetchTopics()
    } else {
      setTopics([])
    }
  }, [selectedCourseId, toast])

  // Fetch material and courses
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        // Fetch lecturer profile
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)

        // Fetch material details
        const materialData = await lecturerService.getTeachingMaterialById(id)
        setMaterial(materialData)

        // Fetch courses assigned to the lecturer
        const lecturerCourses = await lecturerService.getLecturerCourses(lecturerProfile.id)
        setCourses(lecturerCourses)

        // Set form values
        form.reset({
          title: materialData.title,
          description: materialData.description || "",
          courseId: materialData.courseId,
          topic: materialData.topic,
          isPublic: materialData.isPublic,
          allowDownload: materialData.allowDownload,
          tags: materialData.tags ? materialData.tags.join(",") : "",
        })

        // Fetch topics for the material's course
        const courseTopics = await lecturerService.getCourseTopics(materialData.courseId)
        setTopics(courseTopics)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load material data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user, form, toast])

  // Function to get the appropriate icon based on file type
  const getFileIcon = (fileType: string) => {
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true)

      // Process tags from comma-separated string to array
      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : []

      const updatedMaterial = {
        ...values,
        tags: tagsArray,
      }

      await lecturerService.updateTeachingMaterial(id, updatedMaterial)

      toast({
        title: "Success",
        description: "Teaching material updated successfully",
      })

      router.push(`/materials/${id}`)
    } catch (error) {
      console.error("Failed to update material:", error)
      toast({
        title: "Error",
        description: "Failed to update teaching material",
        variant: "destructive",
      })
    } finally {
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
                            {course.code}: {course.name}
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
                          <SelectItem key={topic.id} value={topic.name}>
                            {topic.name}
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
