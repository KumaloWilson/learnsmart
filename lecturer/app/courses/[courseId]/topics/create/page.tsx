"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses, useCourseTopicActions } from "@/lib/auth/hooks"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
// Import the Breadcrumb component
import { Breadcrumb } from "@/components/breadcrumb"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  orderIndex: z.number().min(1, "Order must be at least 1"),
  durationHours: z.number().min(1, "Duration must be at least 1 hour"),
  learningObjectives: z.array(z.string()).min(1, "At least one learning objective is required"),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  difficulty: z.string().min(1, "Please select a difficulty level"),
  isActive: z.boolean().default(true),
})

export default function CreateCourseTopicPage() {
  const { courseId } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { lecturerProfile } = useAuth()
  const { getCourses, courses, isLoading: isLoadingCourses } = useCourses()
  const { createCourseTopic, isLoading, error, success } = useCourseTopicActions()
  const [courseDetails, setCourseDetails] = useState<any>(null)
  const [newObjective, setNewObjective] = useState("")
  const [newKeyword, setNewKeyword] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      orderIndex: 1,
      durationHours: 2,
      learningObjectives: [],
      keywords: [],
      difficulty: "beginner",
      isActive: true,
    },
  })

  useEffect(() => {
    const fetchCourseData = async () => {
      if (lecturerProfile?.id && courseId) {
        try {
          const coursesData = await getCourses(lecturerProfile.id)
          const course = coursesData.find((c) => c.courseId === courseId)

          if (course) {
            setCourseDetails(course)
          }
        } catch (err) {
          console.error("Error fetching course data:", err)
        }
      }
    }

    fetchCourseData()
  }, [courseId, lecturerProfile, getCourses])

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      })
    }
    if (success) {
      toast({
        title: "Success",
        description: "Topic created successfully",
      })
      router.push(`/courses/${courseId}/topics`)
    }
  }, [error, success, toast, router, courseId])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!courseDetails) return

    try {
      await createCourseTopic({
        title: values.title,
        description: values.description,
        orderIndex: values.orderIndex,
        durationHours: values.durationHours,
        learningObjectives: values.learningObjectives,
        keywords: values.keywords,
        difficulty: values.difficulty,
        isActive: values.isActive,
        courseId: courseDetails.courseId,
        semesterId: courseDetails.semesterId,
      })
    } catch (err) {
      console.error("Error creating course topic:", err)
    }
  }

  const addLearningObjective = () => {
    if (newObjective.trim()) {
      const currentObjectives = form.getValues("learningObjectives")
      form.setValue("learningObjectives", [...currentObjectives, newObjective.trim()])
      setNewObjective("")
    }
  }

  const removeLearningObjective = (index: number) => {
    const currentObjectives = form.getValues("learningObjectives")
    form.setValue(
      "learningObjectives",
      currentObjectives.filter((_, i) => i !== index),
    )
  }

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = form.getValues("keywords")
      form.setValue("keywords", [...currentKeywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (index: number) => {
    const currentKeywords = form.getValues("keywords")
    form.setValue(
      "keywords",
      currentKeywords.filter((_, i) => i !== index),
    )
  }

  if (isLoadingCourses) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!courseDetails) {
    return (
      <PageContainer title="Create Course Topic" description="Add a new topic to your course">
        <Alert variant="destructive">
          <AlertDescription>Course not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/courses">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
            </Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Create Course Topic" description={`Add a new topic to ${courseDetails.courseCode}`}>
      {/* Add the breadcrumb navigation before the main content */}
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: courseDetails?.courseName || "Course", href: `/courses/${courseId}` },
          { label: "Topics", href: `/courses/${courseId}/topics` },
          { label: "Create Topic" },
        ]}
        className="mb-4"
      />
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-2">
          <Link href={`/courses/${courseId}/topics`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{courseDetails.courseCode}</h2>
          <p className="text-muted-foreground">{courseDetails.courseName}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Topic</CardTitle>
          <CardDescription>Create a new topic for {courseDetails.courseCode}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Introduction to Machine Learning" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A comprehensive introduction to machine learning concepts and applications"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="orderIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Index</FormLabel>
                      <FormDescription>The sequence number of this topic in the course</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (hours)</FormLabel>
                      <FormDescription>Estimated time to complete this topic</FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="learningObjectives"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Objectives</FormLabel>
                    <FormDescription>What students will learn from this topic</FormDescription>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a learning objective"
                        value={newObjective}
                        onChange={(e) => setNewObjective(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addLearningObjective()
                          }
                        }}
                      />
                      <Button type="button" onClick={addLearningObjective} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {field.value.map((objective, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                          <span className="text-sm">{objective}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLearningObjective(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormDescription>Key terms related to this topic</FormDescription>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add a keyword"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addKeyword()
                          }
                        }}
                      />
                      <Button type="button" onClick={addKeyword} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {field.value.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {keyword}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeKeyword(index)}
                            className="h-4 w-4 p-0 ml-1"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Activate Topic</FormLabel>
                      <FormDescription>Make this topic visible to students</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" asChild>
                  <Link href={`/courses/${courseId}/topics`}>Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Topic"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
