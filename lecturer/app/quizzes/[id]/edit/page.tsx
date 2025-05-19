"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useQuiz, useQuizActions } from "@/lib/auth/hooks"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
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
})

export default function EditQuizPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { getQuizById, quiz, isLoading } = useQuiz()
  const { updateQuiz, isLoading: isUpdating, error, success } = useQuizActions()
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
    },
  })

  useEffect(() => {
  let isMounted = true

  const fetchQuiz = async () => {
    if (id && isMounted) {
      try {
        console.log('Fetching quiz data for editing, ID:', id)
        const quizData = await getQuizById(id as string)

        if (quizData && isMounted) {
          // Format dates for input fields
          const startDate = new Date(quizData.startDate)
          const endDate = new Date(quizData.endDate)

          // Format to YYYY-MM-DDThh:mm
          const formatDateForInput = (date: Date) => {
            return date.toISOString().slice(0, 16)
          }

          // Set form values
          form.reset({
            title: quizData.title,
            description: quizData.description,
            topic: quizData.topic,
            numberOfQuestions: quizData.numberOfQuestions,
            timeLimit: quizData.timeLimit,
            startDate: formatDateForInput(startDate),
            endDate: formatDateForInput(endDate),
            totalMarks: quizData.totalMarks,
            passingMarks: quizData.passingMarks,
            isActive: quizData.isActive,
            isRandomized: quizData.isRandomized,
            difficulty: quizData.aiPrompt?.difficulty || 'medium',
            focus: quizData.aiPrompt?.focus || '',
            questionType: quizData.questionType,
            instructions: quizData.instructions,
          })
          console.log('Form populated with quiz data')
        }
      } catch (err) {
        console.error("Error fetching quiz:", err)
      }
    }
  }

  fetchQuiz()

  return () => {
    isMounted = false
  }
}, [id]) // Only depend on ID

// Separate effect for handling success/error states
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
    router.push(`/quizzes/${id}`)
  }
}, [error, success, toast, router, id])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (new Date(values.endDate) <= new Date(values.startDate)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "End date must be after start date",
      })
      return
    }

    if (values.passingMarks > values.totalMarks) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passing marks cannot be greater than total marks",
      })
      return
    }

    try {
      await updateQuiz(id as string, {
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
      })
    } catch (err) {
      console.error("Error updating quiz:", err)
    }
  }

  const nextTab = () => {
    if (activeTab === "basic") {
      // Validate basic fields before proceeding
      const basicFields = ["title", "description", "topic"]
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

  if (isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading quiz details...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <PageContainer title="Edit Quiz" description="Update quiz details">
        <Alert variant="destructive">
          <AlertDescription>Quiz not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/quizzes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
            </Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Edit Quiz" description="Update quiz details">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-2">
          <Link href={`/quizzes/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-xl font-semibold">Edit: {quiz.title}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>Update the details of your quiz</CardDescription>
        </CardHeader>
        <CardContent>
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
                          <FormDescription>
                            Specify what the AI should focus on when generating questions
                          </FormDescription>
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
                            <FormDescription>Make this quiz available to students</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button type="button" variant="outline" onClick={prevTab}>
                        Previous
                      </Button>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                          </>
                        ) : (
                          "Update Quiz"
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  )
}
