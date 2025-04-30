"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Clock, AlertTriangle, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { lecturerService } from "@/lib/api-services"

// Form schema
const formSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    topic: z.string().min(3, "Topic must be at least 3 characters"),
    courseId: z.string().min(1, "Please select a course"),
    semesterId: z.string().min(1, "Please select a semester"),
    questionType: z.enum(["multiple_choice", "true_false", "short_answer", "mixed"]),
    numberOfQuestions: z.coerce
      .number()
      .min(1, "Must have at least 1 question")
      .max(100, "Cannot exceed 100 questions"),
    timeLimit: z.coerce.number().min(1, "Time limit must be at least 1 minute"),
    totalMarks: z.coerce.number().min(1, "Total marks must be at least 1"),
    passingMarks: z.coerce.number().min(1, "Passing marks must be at least 1"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    isRandomized: z.boolean().default(false),
    isActive: z.boolean().default(true),
    instructions: z.string().optional(),
    aiGenerated: z.boolean().default(false),
    aiPromptTopic: z.string().optional(),
    aiPromptLevel: z.string().optional(),
  })
  .refine((data) => data.passingMarks <= data.totalMarks, {
    message: "Passing marks cannot be greater than total marks",
    path: ["passingMarks"],
  })
  .refine(
    (data) => {
      return data.endDate > data.startDate
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    },
  )

export function QuizForm({ quiz = null }) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [courses, setCourses] = useState([])
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: quiz || {
      title: "",
      description: "",
      topic: "",
      courseId: "",
      semesterId: "",
      questionType: "multiple_choice",
      numberOfQuestions: 10,
      timeLimit: 30,
      totalMarks: 100,
      passingMarks: 50,
      isRandomized: false,
      isActive: true,
      instructions: "",
      aiGenerated: false,
    },
  })

  // Fetch courses and semesters
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        // Get lecturer profile
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)

        // Get courses assigned to the lecturer
        const lecturerCourses = await lecturerService.getLecturerCourses(lecturerProfile.id)
        setCourses(lecturerCourses)

        // Get active semesters
        const activeSemesters = await lecturerService.getActiveSemesters()
        setSemesters(activeSemesters)

        // Set default semester if we have one
        if (activeSemesters.length > 0 && !quiz) {
          form.setValue("semesterId", activeSemesters[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast({
          title: "Error",
          description: "Failed to load courses and semesters",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [form, quiz, user, toast])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setSubmitting(true)

      if (!user?.id) {
        throw new Error("User not authenticated")
      }

      const lecturerProfile = await lecturerService.getLecturerProfile(user.id)

      // Prepare quiz data
      const quizData = {
        ...values,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        lecturerProfileId: lecturerProfile.id,
      }

      if (quiz) {
        // Update existing quiz
        await lecturerService.updateQuiz(quiz.id, quizData)
        toast({
          title: "Success",
          description: "Quiz updated successfully",
        })
      } else {
        // Create new quiz
        await lecturerService.createQuiz(quizData)
        toast({
          title: "Success",
          description: "Quiz created successfully",
        })
      }

      router.push("/quizzes")
    } catch (error) {
      console.error("Failed to save quiz:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save quiz",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="settings">Quiz Settings</TabsTrigger>
            <TabsTrigger value="ai">AI Generation</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Details</CardTitle>
                <CardDescription>Enter the basic information about your quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Midterm Exam" {...field} />
                      </FormControl>
                      <FormDescription>Enter a clear title for your quiz</FormDescription>
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
                          placeholder="Provide a brief description of the quiz"
                          className="resize-none"
                          {...field}
                        />
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
                        <Input placeholder="e.g. Object-Oriented Programming" {...field} />
                      </FormControl>
                      <FormDescription>The main topic covered by this quiz</FormDescription>
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
                    name="semesterId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {semesters.map((semester) => (
                              <SelectItem key={semester.id} value={semester.id}>
                                {semester.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/quizzes")}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab("settings")}>
                  Next: Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Quiz Settings Tab */}
          <TabsContent value="settings" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Configuration</CardTitle>
                <CardDescription>Set up the structure and parameters of your quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="questionType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Question Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="multiple_choice" />
                            </FormControl>
                            <FormLabel className="font-normal">Multiple Choice</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true_false" />
                            </FormControl>
                            <FormLabel className="font-normal">True/False</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="short_answer" />
                            </FormControl>
                            <FormLabel className="font-normal">Short Answer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="mixed" />
                            </FormControl>
                            <FormLabel className="font-normal">Mixed (Combination of question types)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="100" {...field} />
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
                          <div className="flex items-center">
                            <Input type="number" min="1" {...field} />
                            <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="totalMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
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
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            <div className="p-3 border-t border-border">
                              <Input
                                type="time"
                                onChange={(e) => {
                                  const date = new Date(field.value || new Date())
                                  const [hours, minutes] = e.target.value.split(":")
                                  date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                                  field.onChange(date)
                                }}
                                defaultValue={field.value ? format(field.value, "HH:mm") : undefined}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date & Time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            <div className="p-3 border-t border-border">
                              <Input
                                type="time"
                                onChange={(e) => {
                                  const date = new Date(field.value || new Date())
                                  const [hours, minutes] = e.target.value.split(":")
                                  date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                                  field.onChange(date)
                                }}
                                defaultValue={field.value ? format(field.value, "HH:mm") : undefined}
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add instructions for students"
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Instructions will be displayed to students before they start the quiz
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="isRandomized"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Randomize Questions</FormLabel>
                          <FormDescription>Present questions in random order to each student</FormDescription>
                        </div>
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
                          <FormLabel>Make Quiz Active</FormLabel>
                          <FormDescription>Immediately activate this quiz for students</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab("ai")}>
                  Next: AI Generation
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* AI Generation Tab */}
          <TabsContent value="ai" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>AI-Assisted Question Generation</CardTitle>
                <CardDescription>Use AI to help generate quiz questions based on your specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>AI-Generated Content</AlertTitle>
                  <AlertDescription>
                    AI can help you create questions, but always review them for accuracy and appropriateness before
                    publishing the quiz.
                  </AlertDescription>
                </Alert>

                <FormField
                  control={form.control}
                  name="aiGenerated"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Generate Questions with AI</FormLabel>
                        <FormDescription>
                          Let our AI engine create quiz questions based on your topic and parameters
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("aiGenerated") && (
                  <div className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="aiPromptTopic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Topic Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide more specific details about the topic, concepts, or learning objectives"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Give the AI more context about what concepts to focus on</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aiPromptLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || "medium"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="easy">Beginner</SelectItem>
                              <SelectItem value="medium">Intermediate</SelectItem>
                              <SelectItem value="hard">Advanced</SelectItem>
                              <SelectItem value="mixed">Mixed Levels</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>The AI will adjust the complexity of questions accordingly</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("settings")}>
                  Back
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {quiz ? "Updating Quiz..." : "Creating Quiz..."}
                    </>
                  ) : (
                    <>{quiz ? "Update Quiz" : "Create Quiz"}</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
