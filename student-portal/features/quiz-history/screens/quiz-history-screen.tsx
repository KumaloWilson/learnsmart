"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Clock, Calendar, FileText, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { QuizModal } from "@/features/quizzes/components/quiz-modal"
import { getStudentQuizAttempts } from "@/features/quizzes/redux/quizSlice"

export function QuizHistory() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { attempts, isLoading, error } = useAppSelector((state) => state.quiz)
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      dispatch(
        getStudentQuizAttempts({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Skeleton className="h-10 w-96" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                  </div>
                  <Skeleton className="h-5 w-24" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Group attempts by status
  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "completed" || attempt.status === "timed_out",
  )
  const inProgressAttempts = attempts.filter((attempt) => attempt.status === "in_progress")

  // Sort attempts by date (newest first)
  const sortedCompletedAttempts = [...completedAttempts].sort(
    (a, b) => new Date(b.endTime || b.updatedAt).getTime() - new Date(a.endTime || a.updatedAt).getTime(),
  )

  const handleViewResults = (quizId: string) => {
    setSelectedQuizId(quizId)
    setIsQuizModalOpen(true)
  }

  const handleResumeQuiz = (quizId: string) => {
    setSelectedQuizId(quizId)
    setIsQuizModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quiz History</h1>
        <p className="text-muted-foreground">View your quiz attempts and results</p>
      </div>

      <Tabs defaultValue="completed" className="space-y-4">
        <TabsList>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Completed ({sortedCompletedAttempts.length})</span>
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>In Progress ({inProgressAttempts.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="completed" className="space-y-4">
          {sortedCompletedAttempts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Completed Quizzes</CardTitle>
                <CardDescription>You haven't completed any quizzes yet.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedCompletedAttempts.map((attempt) => (
                <Card key={attempt.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{attempt.quiz?.title}</CardTitle>
                        <CardDescription>{attempt.quiz?.description}</CardDescription>
                      </div>
                      <Badge variant={attempt.isPassed ? "default" : "destructive"}>
                        {attempt.isPassed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attempt.quiz?.course?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(attempt.endTime || attempt.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Score: {attempt.score} / {attempt.quiz?.totalMarks}(
                          {Math.round(((attempt.score || 0) / (attempt.quiz?.totalMarks || 1)) * 100)}%)
                        </span>
                      </div>
                    </div>

                    {attempt.status === "timed_out" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                          <div className="text-sm text-amber-800">
                            This quiz was automatically submitted because the time limit was reached.
                          </div>
                        </div>
                      </div>
                    )}

                    <Button variant="outline" className="w-full" onClick={() => handleViewResults(attempt.id)}>
                      View Results
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {inProgressAttempts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No In-Progress Quizzes</CardTitle>
                <CardDescription>You don't have any quizzes in progress.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {inProgressAttempts.map((attempt) => (
                <Card key={attempt.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{attempt.quiz?.title}</CardTitle>
                        <CardDescription>{attempt.quiz?.description}</CardDescription>
                      </div>
                      <Badge variant="secondary">In Progress</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attempt.quiz?.course?.name}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Started: {new Date(attempt.startTime).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Time Limit: {attempt.quiz?.timeLimit} minutes</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <div className="flex items-start">
                        <AlertTriangle className="h-4 w-4 text-blue-500 mt-0.5 mr-2" />
                        <div className="text-sm text-blue-800">
                          You have an unfinished quiz. Resume to continue where you left off.
                        </div>
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => handleResumeQuiz(attempt.id)}>
                      Resume Quiz
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedQuizId && (
        <QuizModal
          quizId={selectedQuizId}
          isOpen={isQuizModalOpen}
          onClose={() => {
            setIsQuizModalOpen(false)
            setSelectedQuizId(null)
          }}
        />
      )}
    </div>
  )
}
