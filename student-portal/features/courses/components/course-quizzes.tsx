"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { QuizCard } from "@/features/quizzes/components/quiz-card"
import { getStudentQuizAttempts } from "@/features/quizzes/redux/quizSlice"

interface CourseQuizzesProps {
  courseId: string
  quizzes: any[]
}

export function CourseQuizzes({ courseId, quizzes }: CourseQuizzesProps) {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { attempts, isLoading, error } = useAppSelector((state) => state.quiz)

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      // Add this console log to verify the courseId being passed
      console.log("Fetching attempts for courseId:", courseId)
      
      dispatch(
        getStudentQuizAttempts({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken, courseId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
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

  // Filter quizzes for this course with proper error handling
  const courseQuizzes = Array.isArray(quizzes) 
    ? quizzes.filter((quiz) => quiz && quiz.courseId === courseId)
    : []

  console.log("Filtered quizzes for courseId:", courseId, courseQuizzes)

  if (courseQuizzes.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Quizzes</h3>
        <p className="text-muted-foreground">No quizzes are available for this course at this time.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Quizzes</h3>
      <p className="text-muted-foreground">Complete these quizzes to test your knowledge and track your progress.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {courseQuizzes.map((quiz) => {
          // Find all attempts for this specific quiz
          const quizAttempts = Array.isArray(attempts) 
            ? attempts.filter((attempt) => attempt && attempt.quizId === quiz.id)
            : []
          
          // Find the most recent attempt for this quiz
          const latestAttempt =
            quizAttempts.length > 0
              ? quizAttempts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
              : null

          const isCompleted = latestAttempt?.status === "completed" || latestAttempt?.status === "timed_out"

          return (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isCompleted={isCompleted}
              score={latestAttempt?.score}
              isPassed={latestAttempt?.isPassed}
            />
          )
        })}
      </div>
    </div>
  )
}