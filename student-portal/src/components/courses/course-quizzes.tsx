"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Calendar, CheckCircle2, XCircle } from "lucide-react"

interface CourseQuizzesProps {
  quizzes: any[]
  isLoading: boolean
}

export function CourseQuizzes({ quizzes, isLoading }: CourseQuizzesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Quizzes Available</CardTitle>
          <CardDescription>There are no quizzes available for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getStatusBadge = (quiz: any) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)

    if (quiz.completed) {
      return <Badge variant="secondary">Completed</Badge>
    } else if (now < startDate) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (now > endDate) {
      return <Badge variant="destructive">Missed</Badge>
    } else {
      return <Badge variant="success">Available</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => (
        <Card key={quiz.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </div>
              {getStatusBadge(quiz)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Available: {new Date(quiz.startDate).toLocaleDateString()} -{" "}
                    {new Date(quiz.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Time Limit: {quiz.timeLimit} minutes</span>
                </div>
                {quiz.completed && (
                  <div className="flex items-center gap-2">
                    {quiz.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      Score: {quiz.score}/{quiz.totalPoints}
                    </span>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                asChild
                disabled={
                  !quiz.completed && (new Date() < new Date(quiz.startDate) || new Date() > new Date(quiz.endDate))
                }
              >
                <Link href={quiz.completed ? `/quizzes/${quiz.id}/results/${quiz.attemptId}` : `/quizzes/${quiz.id}`}>
                  {quiz.completed ? "View Results" : "Take Quiz"}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
