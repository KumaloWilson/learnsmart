"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, Loader2, ArrowLeft, Edit, Trash2, Users, CheckCircle, XCircle, BarChart } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useQuiz, useQuizActions, useQuizStatistics } from "@/lib/auth/hooks"
import { formatDate } from "@/lib/utils"
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
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { QuizAttemptsTable } from "@/components/quiz-attempts-table"

export default function QuizDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { lecturerProfile } = useAuth()
  const { getQuizById, quiz, isLoading } = useQuiz()
  const { updateQuiz, deleteQuiz, isLoading: isActionLoading, error, success } = useQuizActions()
  const {
    getQuizStatistics,
    getQuizAttempts,
    statistics,
    attempts,
    isLoading: isLoadingStatistics,
  } = useQuizStatistics()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

 useEffect(() => {
  let isMounted = true

  const fetchData = async () => {
    if (id && isMounted) {
      try {
        console.log('Fetching quiz data for ID:', id)
        await getQuizById(id as string)
        console.log('Quiz data fetched successfully')
      } catch (err) {
        console.error("Error fetching quiz data:", err)
      }
    }
  }

  fetchData()

  return () => {
    isMounted = false
  }
}, [id]) // Remove getQuizById from dependencies

// Separate effect for statistics/attempts after quiz is loaded
useEffect(() => {
  let isMounted = true

  const fetchStatistics = async () => {
    if (quiz && quiz.id && isMounted) {
      try {
        console.log('Fetching statistics for quiz:', quiz.id)
        await getQuizStatistics(quiz.id)
        await getQuizAttempts(quiz.id)
        console.log('Statistics fetched successfully')
      } catch (err) {
        console.error("Error fetching quiz statistics or attempts:", err)
      }
    }
  }

  fetchStatistics()

  return () => {
    isMounted = false
  }
}, [quiz?.id]) // Only run when quiz.id changes

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
      if (isDeleteDialogOpen) {
        router.push("/quizzes")
      }
    }
  }, [error, success, toast, router, isDeleteDialogOpen])

  const handleToggleActive = async () => {
    if (!quiz) return

    try {
      await updateQuiz(quiz.id, {
        isActive: !quiz.isActive,
      })

      // Update local state
      getQuizById(quiz.id)
    } catch (err) {
      console.error("Error toggling quiz active state:", err)
    }
  }

  const handleDeleteQuiz = async () => {
    if (!quiz) return

    try {
      await deleteQuiz(quiz.id)
    } catch (err) {
      console.error("Error deleting quiz:", err)
    }
  }

  const isQuizActive = (quiz: any) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)
    return now >= startDate && now <= endDate && quiz.isActive
  }

  const isQuizUpcoming = (quiz: any) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    return now < startDate && quiz.isActive
  }

  const isQuizExpired = (quiz: any) => {
    const now = new Date()
    const endDate = new Date(quiz.endDate)
    return now > endDate || !quiz.isActive
  }

  const getQuizStatusBadge = (quiz: any) => {
    if (isQuizActive(quiz)) {
      return <Badge variant="default">Active</Badge>
    } else if (isQuizUpcoming(quiz)) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (isQuizExpired(quiz)) {
      return <Badge variant="secondary">Expired</Badge>
    } else {
      return <Badge variant="destructive">Inactive</Badge>
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
      <PageContainer title="Quiz Details" description="View and manage quiz">
        <Alert variant="destructive">
          <AlertDescription>Quiz not found or could not be loaded</AlertDescription>
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
    <PageContainer title={quiz.title} description="Quiz details and management">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/quizzes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          {getQuizStatusBadge(quiz)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/quizzes/${quiz.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          {quiz.isActive ? (
            <Button variant="outline" onClick={handleToggleActive}>
              <XCircle className="mr-2 h-4 w-4" /> Deactivate
            </Button>
          ) : (
            <Button variant="outline" onClick={handleToggleActive}>
              <CheckCircle className="mr-2 h-4 w-4" /> Activate
            </Button>
          )}
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              {quiz.course?.code || "No course code"}
            </div>
            <p className="text-sm text-muted-foreground">{quiz.semester?.name || "No semester"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-lg font-medium">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                {formatDate(quiz.startDate)} - {formatDate(quiz.endDate)}
              </span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{quiz.timeLimit} minutes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{quiz.numberOfQuestions} questions</div>
            <p className="text-sm text-muted-foreground">
              {quiz.totalMarks} total marks, {quiz.passingMarks} to pass
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="attempts">Attempts</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>Information about this quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-muted-foreground">{quiz.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">Topic</h3>
                <p className="mt-2 text-muted-foreground">{quiz.topic}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">Instructions</h3>
                <p className="mt-2 text-muted-foreground">{quiz.instructions}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">Quiz Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium">Question Type</p>
                    <p className="text-sm text-muted-foreground capitalize">{quiz.questionType.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Randomized Questions</p>
                    <p className="text-sm text-muted-foreground">{quiz.isRandomized ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Marks</p>
                    <p className="text-sm text-muted-foreground">{quiz.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Passing Marks</p>
                    <p className="text-sm text-muted-foreground">{quiz.passingMarks}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium">AI Generation Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium">Difficulty</p>
                    <p className="text-sm text-muted-foreground capitalize">{quiz.aiPrompt.difficulty}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Focus Area</p>
                    <p className="text-sm text-muted-foreground">{quiz.aiPrompt.focus}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Statistics</CardTitle>
              <CardDescription>Performance metrics for this quiz</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStatistics ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : statistics ? (
                <>
                  <div className="grid gap-6 md:grid-cols-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Attempts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {statistics.attemptedCount}/{statistics.totalStudents}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((statistics.attemptedCount / statistics.totalStudents) * 100)}% of students
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{statistics.averageScore}%</div>
                        <Progress value={statistics.averageScore} className="h-2 mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{statistics.passRate}%</div>
                        <Progress value={statistics.passRate} className="h-2 mt-2" />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Score Range</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {statistics.lowestScore}% - {statistics.highestScore}%
                        </div>
                        <p className="text-xs text-muted-foreground">Median: {statistics.medianScore}%</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="rounded-md border p-4 text-center">
                    <BarChart className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
                    <p className="text-muted-foreground">Detailed score distribution chart will be implemented here</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
                  <p className="text-muted-foreground">No statistics available for this quiz yet</p>
                  {isQuizUpcoming(quiz) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Statistics will be available after students start taking the quiz
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Attempts</CardTitle>
              <CardDescription>Student attempts for this quiz</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStatistics ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : attempts && attempts.length > 0 ? (
                <QuizAttemptsTable attempts={attempts} />
              ) : (
                <div className="text-center py-8">
                  <Users className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
                  <p className="text-muted-foreground">No attempts recorded for this quiz yet</p>
                  {isQuizUpcoming(quiz) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Attempts will be recorded after students take the quiz
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the quiz and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteQuiz} disabled={isActionLoading}>
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
