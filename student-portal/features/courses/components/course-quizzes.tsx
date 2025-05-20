"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { QuizCard } from "@/features/quizzes/components/quiz-card"

interface Quiz {
  id: string
  courseId: string
  // Add other quiz properties as needed
}

interface QuizAttempt {
  id: string
  quizId: string
  status: string
  score?: number
  isPassed?: boolean
  createdAt: string
  // Add other attempt properties as needed
}

interface CourseQuizzesProps {
  quizzes: Quiz[]
  quizAttempts: QuizAttempt[]
}

export function CourseQuizzes({ quizzes, quizAttempts }: CourseQuizzesProps) {
  if (quizzes.length === 0) {
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
        {quizzes.map((quiz) => {
          // Find the most recent attempt for this quiz
          const quizAttemptsList = quizAttempts.filter((attempt) => attempt.quizId === quiz.id)
          const latestAttempt =
            quizAttemptsList.length > 0
              ? quizAttemptsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
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