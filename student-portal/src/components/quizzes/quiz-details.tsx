"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { startQuizAttempt } from "@/lib/api/quizzes-api"
import { AlertCircle, Clock, Calendar, CheckCircle2, Info } from "lucide-react"
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

interface QuizDetailsProps {
  quiz: any
}

export function QuizDetails({ quiz }: QuizDetailsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [isStarting, setIsStarting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleStartQuiz = async () => {
    if (!user?.studentProfileId) return

    setIsStarting(true)
    try {
      const response = await startQuizAttempt({
        quizId: quiz.id,
        studentProfileId: user.studentProfileId,
      })

      router.push(`/quizzes/${quiz.id}/attempt?attemptId=${response.id}`)
    } catch (error) {
      console.error("Error starting quiz:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start the quiz. Please try again.",
      })
      setIsStarting(false)
    }
  }

  const isAvailable = new Date() >= new Date(quiz.startDate) && new Date() <= new Date(quiz.endDate)
  const isPast = new Date() > new Date(quiz.endDate)
  const isFuture = new Date() < new Date(quiz.startDate)

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <CardDescription>{quiz.course?.name}</CardDescription>
              </div>
              <Badge
                variant={quiz.completed ? "secondary" : isAvailable ? "success" : isPast ? "destructive" : "outline"}
              >
                {quiz.completed ? "Completed" : isAvailable ? "Available" : isPast ? "Closed" : "Upcoming"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Available: {new Date(quiz.startDate).toLocaleDateString()} -{" "}
                  {new Date(quiz.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Time Limit: {quiz.timeLimit} minutes</span>
              </div>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              <h3>Description</h3>
              <p>{quiz.description}</p>
            </div>

            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Quiz Information</h3>
              </div>
              <ul className="space-y-1 text-sm">
                <li>Total Questions: {quiz.questionCount}</li>
                <li>Total Points: {quiz.totalPoints}</li>
                <li>Passing Score: {quiz.passingScore}%</li>
                <li>Attempts Allowed: {quiz.maxAttempts === -1 ? "Unlimited" : quiz.maxAttempts}</li>
                {quiz.attemptsUsed > 0 && (
                  <li>
                    Your Attempts: {quiz.attemptsUsed} / {quiz.maxAttempts === -1 ? "∞" : quiz.maxAttempts}
                  </li>
                )}
              </ul>
            </div>

            {quiz.completed ? (
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Quiz Completed</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium">Your Score</h4>
                    <p className="text-2xl font-bold">
                      {quiz.score}/{quiz.totalPoints}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round((quiz.score / quiz.totalPoints) * 100)}%
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Status</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {quiz.passed ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          <span className="font-medium text-green-500">Passed</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-destructive" />
                          <span className="font-medium text-destructive">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <Button asChild>
                  <a href={`/quizzes/${quiz.id}/results/${quiz.attemptId}`}>View Results</a>
                </Button>

                {quiz.attemptsUsed < quiz.maxAttempts || quiz.maxAttempts === -1 ? (
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={!isAvailable}
                  >
                    Attempt Again
                  </Button>
                ) : null}
              </div>
            ) : (
              <>
                {!isAvailable && (
                  <div className="bg-muted p-4 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium">
                        {isPast ? "This quiz is closed" : "This quiz is not yet available"}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {isPast
                          ? `The quiz closed on ${new Date(quiz.endDate).toLocaleString()}.`
                          : `The quiz will be available from ${new Date(quiz.startDate).toLocaleString()}.`}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  disabled={!isAvailable || isStarting}
                  className="w-full"
                >
                  {isStarting ? "Starting Quiz..." : "Start Quiz"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to start the quiz "{quiz.title}". Once you start, the timer will begin and you will have{" "}
              {quiz.timeLimit} minutes to complete it.
              {quiz.attemptsUsed > 0 && (
                <p className="mt-2">
                  This will be attempt {quiz.attemptsUsed + 1} of{" "}
                  {quiz.maxAttempts === -1 ? "unlimited" : quiz.maxAttempts} allowed attempts.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartQuiz}>Start Quiz</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
