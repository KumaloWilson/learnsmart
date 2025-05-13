"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"
import { Clock, FileQuestion } from "lucide-react"

type Quiz = {
  id: string
  title: string
  description: string
  course: {
    id: string
    name: string
  }
  startDate: string
  endDate: string
  duration: number // in minutes
  totalQuestions: number
  status: string
  attempts?: number
  maxAttempts: number
  bestScore?: number
  lastAttemptId?: string
}

type QuizzesListProps = {
  quizzes: Quiz[]
  emptyMessage?: string
}

export function QuizzesList({ quizzes, emptyMessage = "No quizzes found." }: QuizzesListProps) {
  if (!quizzes.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <FileQuestion className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No quizzes found</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  )
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  const statusColors: Record<string, string> = {
    upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const startDate = new Date(quiz.startDate)
  const endDate = new Date(quiz.endDate)
  const now = new Date()
  const isAvailable = now >= startDate && now <= endDate
  const isExpired = now > endDate
  const isUpcoming = now < startDate

  // Calculate attempts progress
  const attemptsUsed = quiz.attempts || 0
  const attemptsProgress = (attemptsUsed / quiz.maxAttempts) * 100

  // Determine action button based on status
  let actionButton
  if (isUpcoming) {
    actionButton = (
      <Button variant="outline" disabled>
        Not Available Yet
      </Button>
    )
  } else if (isExpired) {
    actionButton = quiz.lastAttemptId ? (
      <Button variant="outline" asChild>
        <Link href={`/quizzes/${quiz.id}/results/${quiz.lastAttemptId}`}>View Results</Link>
      </Button>
    ) : (
      <Button variant="outline" disabled>
        Expired
      </Button>
    )
  } else if (attemptsUsed >= quiz.maxAttempts) {
    actionButton = (
      <Button variant="outline" asChild>
        <Link href={`/quizzes/${quiz.id}/results/${quiz.lastAttemptId}`}>View Results</Link>
      </Button>
    )
  } else {
    actionButton = (
      <Button asChild>
        <Link href={`/quizzes/${quiz.id}/attempt`}>Start Quiz</Link>
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{quiz.title}</CardTitle>
          <Badge className={statusColors[quiz.status] || statusColors.upcoming}>
            {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{quiz.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="text-sm font-medium">{quiz.totalQuestions} questions</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="text-sm font-medium">{quiz.duration} minutes</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Available From</p>
            <p className="text-sm font-medium">{format(startDate, "MMM d, yyyy")}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Available Until</p>
            <p className="text-sm font-medium">{format(endDate, "MMM d, yyyy")}</p>
          </div>
        </div>

        {quiz.bestScore !== undefined && (
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>Best Score</span>
              <span>{quiz.bestScore}%</span>
            </div>
            <Progress value={quiz.bestScore} className="h-2" />
          </div>
        )}

        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>Attempts</span>
            <span>
              {attemptsUsed} of {quiz.maxAttempts}
            </span>
          </div>
          <Progress value={attemptsProgress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{quiz.duration} min</span>
          </div>
          <div className="text-sm text-muted-foreground">{quiz.course.name}</div>
        </div>
        {actionButton}
      </CardFooter>
    </Card>
  )
}
