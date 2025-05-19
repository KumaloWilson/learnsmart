"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { useQuizActions, useCourses } from "@/lib/auth/hooks"
import { useToast } from "@/components/ui/use-toast"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  numberOfQuestions: z.number().min(1, "Must have at least 1 question").max(100, "Cannot exceed 100 questions"),
  timeLimit: z
    .number()
    .min(5, "Time limit must be at least 5 minutes")
    .max(180, "Time limit cannot exceed 180 minutes"),
  startDate: z.string().min(1, "Please select a start date"),
  endDate: z.string().min(1, "Please select an end date"),
  totalMarks: z.number().min(1, "Total marks must be at least 1"),
  passingMarks: z.number().min(1, "Passing marks must be at least 1"),
  isActive: z.boolean().default(true),
  isRandomized: z.boolean().default(true),
  difficulty: z.string().min(1, "Please select a difficulty level"),
  focus: z.string().min(3, "Focus area must be at least 3 characters"),
  questionType: z.string().min(1, "Please select a question type"),
  instructions: z.string().min(10, "Instructions must be at least 10 characters"),
  courseId: z.string().min(1, "Please select a course"),
  semesterId: z.string().min(1, "Please select a semester"),
})

interface CreateQuizDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lecturerId: string
  initialCourseId?: string
  initialSemesterId?: string
}

export function CreateQuizDialog({
  open,
  onOpenChange,
  lecturerId,
  initialCourseId,
  initialSemesterId,
}: CreateQuizDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { createQuiz, isLoading, error, success, setError } = useQuizActions()
  const { getCourses, courses, isLoading: isLoadingCourses } = useCourses()
  const [selectedCourse, setSelectedCourse] = useState<string | null>(initialCourseId || null)
  const [activeTab, setActiveTab] = useState("basic")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      topic: "",
      numberOfQuestions: 10,
      timeLimit: 30,
      startDate: "",
      endDate: "",
      totalMarks: 100,
      passingMarks: 50,
      isActive: true,
      isRandomized: true,
      difficulty: "medium",
      focus: "",
      questionType: "multiple_choice",
      instructions: "Answer all questions. No negative marking.",
      courseId: initialCourseId || "",
      semesterId: initialSemesterId || "",
    },
  })

  useEffect(() => {
    if (lecturerId && open) {
      getCourses(lecturerId)
    }
  }, [lecturerId, getCourses, open])

  useEffect(() => {
    if (initialCourseId && initialSemesterId && open) {
      form.setValue("courseId", initialCourseId)
      form.setValue("semesterId", initialSemesterId)
      setSelectedCourse(initialCourseId)
    }
  }, [initialCourseId, initialSemesterId, open, form])

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
        description: success,
      })
      onOpenChange(false)
      router.refresh()
    }
  }, [error, success, toast, onOpenChange, router])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (new Date(values.endDate) <= new Date(values.startDate)) {
      setError("End date must be after start date")
      return
    }

    if (values.passingMarks > values.totalMarks) {
      setError("Passing marks cannot be greater than total marks")
      return
    }

    try {
      await createQuiz({
        title: values.title,
        description: values.description,
        topic: values.topic,
        numberOfQuestions: values.numberOfQuestions,
        timeLimit: values.timeLimit,
        startDate: values.startDate,
        endDate: values.endDate,
        totalMarks: values.totalMarks,
        passingMarks: values.passingMarks,
        isActive: values.isActive,
        isRandomized: values.isRandomized,
        aiPrompt: {
          difficulty: values.difficulty,
          focus: values.focus,
        },
        questionType: values.questionType,
        instructions: values.instructions,
        lecturerProfileId: lecturerId,
        courseId: values.courseId,
        semesterId: values.semesterId,
      })
    } catch (err) {
      console.error("Error creating quiz:", err)
    }
  }

  // Get available semesters for the selected course
  const getAvailableSemesters = () => {
    if (!selectedCourse) return []

    const course = courses.find((c) => c.courseId === selectedCourse)
    if (!course) return []

    return [
      {
        id: course.semesterId,
        name: course.semesterName,
      },
    ]
  }

  const nextTab = () => {
    if (activeTab === "basic") {
      // Validate basic fields before proceeding
      const basicFields = ["title", "description", "topic", "courseId", "semesterId"]
      const isValid = basicFields.every((field) => {
        const result = form.trigger(field as any)
        return result
      })

      if (isValid) {
        setActiveTab("settings")
      }
    } else if (activeTab === "settings") {
      // Validate settings fields before proceeding
      const settingsFields = ["numberOfQuestions", "timeLimit", "startDate", "endDate", "totalMarks", "passingMarks"]
      const isValid = settingsFields.every((field) => {
        const result = form.trigger(field as any)
        return result
      })

      if (isValid) {
        setActiveTab("ai")
      }
    }
  }

  const prevTab = () => {
    if (activeTab === "settings") {
      setActiveTab("basic")
    } else if (activeTab === "ai") {
      setActiveTab("settings")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Quiz</DialogTitle>
          <DialogDescription>Create a new quiz for your students. Fill in the details below.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="ai">AI Generation</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
              <TabsContent value="basic">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quiz Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Introduction to AI" {...field} />
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
                          <Textarea placeholder="A quiz covering the basics of artificial intelligence" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input placeholder="Artificial Intelligence" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Course</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value)
                              setSelectedCourse(value)

                              // Auto-select semester if there's only one
                              const course = courses.find((c) => c.courseId === value)
                              if (course) {
                                form.setValue("semesterId", course.semesterId)
                              }
                            }}
                            value={field.value}
                            disabled={!!initialCourseId}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {isLoadingCourses ? (
                                <div className="flex items-center justify-center p-2">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span>Loading courses...</span>
                                </div>
                              ) : (
                                courses.map((course) => (
                                  <SelectItem key={course.courseId} value={course.courseId}>
                                    {course.courseCode} - {course.courseName}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="semesterId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!!initialSemesterId}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedCourse ? (
                                getAvailableSemesters().map((semester) => (
                                  <SelectItem key={semester.id} value={semester.id}>
                                    {semester.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <div className="flex items-center justify-center p-2 text-muted-foreground">
                                  Select a course first
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={nextTab}>
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="numberOfQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Questions</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              max={100}
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
                      name="timeLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Limit (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={5}
                              max={180}
                              {...field}
                              onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="totalMarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Marks</FormLabel>
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
                      name="passingMarks"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passing Marks</FormLabel>
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="questionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select question type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="true_false">True/False</SelectItem>
                              <SelectItem value="short_answer">Short Answer</SelectItem>
                              <SelectItem value="essay">Essay</SelectItem>
                              <SelectItem value="mixed">Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isRandomized"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mt-7">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Randomize Questions</FormLabel>
                            <FormDescription>
                              Questions will be presented in random order to each student
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Instructions for students taking the quiz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextTab}>
                      Next
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai">
                <div className="space-y-4">
                  <div className="rounded-md border p-4 bg-muted/50">
                    <h3 className="font-medium mb-2">AI-Generated Questions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure how the AI should generate questions for this quiz. The system will create questions
                      based on your settings.
                    </p>
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
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                            <SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="focus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Focus Area</FormLabel>
                        <FormDescription>Specify what the AI should focus on when generating questions</FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., natural language processing, neural networks, machine learning algorithms"
                            {...field}
                          />
                        </FormControl>
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
                          <FormLabel>Activate Quiz</FormLabel>
                          <FormDescription>
                            Make this quiz available to students immediately after creation
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={prevTab}>
                      Previous
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                        </>
                      ) : (
                        "Create Quiz"
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}