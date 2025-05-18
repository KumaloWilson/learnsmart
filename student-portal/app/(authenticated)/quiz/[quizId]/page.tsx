"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { startQuiz, loadCachedQuiz } from "@/lib/redux/slices/quizSlice"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { QuizTaking } from "@/components/quiz/quiz-taking"
import { QuizResults } from "@/components/quiz/quiz-results"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const quizId = params.quizId as string

  const { currentAttempt, isLoading, error, submissionResult } = useAppSelector((state) => state.quiz)
  const { courseDetails } = useAppSelector((state) => state.course)

  useEffect(() => {
    // Check if there's a cached quiz attempt
    dispatch(loadCachedQuiz())
  }, [dispatch])

  useEffect(() => {
    // If no cached quiz and not already loading, start a new quiz
    if (!currentAttempt && !isLoading && !submissionResult) {
      dispatch(startQuiz(quizId))
    }
  }, [dispatch, quizId, currentAttempt, isLoading, submissionResult])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // Show quiz results if available
  if (submissionResult) {
    return <QuizResults result={submissionResult} />
  }

  // Show quiz taking interface if quiz is in progress
  if (currentAttempt) {
    return <QuizTaking attempt={currentAttempt} />
  }

  // Fallback loading state
  return (
    <div className="flex h-full w-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
