"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, FileText, AlertTriangle } from "lucide-react"
import { QuizModal } from "./quiz-modal"
import { Quiz } from "../types"

interface QuizCardProps {
  quiz: Quiz
  isCompleted?: boolean
  score?: number | null
  isPassed?: boolean | null
}

export function QuizCard({ quiz, isCompleted = false, score = null, isPassed = null }: QuizCardProps) {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)

  // Format dates
  const startDate = new Date(quiz.startDate)
  const endDate = new Date(quiz.endDate)
  const now = new Date()

  // Check if quiz is available
  const isAvailable = now >= startDate && now <= endDate && quiz.isActive

  // Format date ranges
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }

  const formattedStartDate = startDate.toLocaleDateString(undefined, dateOptions)
  const formattedEndDate = endDate.toLocaleDateString(undefined, dateOptions)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            {isCompleted ? (
              <Badge variant={isPassed ? "default" : "destructive"}>{isPassed ? "Passed" : "Failed"}</Badge>
            ) : (
              <Badge variant={isAvailable ? "default" : "secondary"}>{isAvailable ? "Available" : "Unavailable"}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{quiz.timeLimit} minutes</span>
            </div>
            <div className="flex items-center">
              <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{quiz.numberOfQuestions} questions</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {formattedStartDate} - {formattedEndDate}
              </span>
            </div>
          </div>

          {isCompleted && score !== null && (
            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Your Score:</span>
                <span className="font-bold">
                  {score} / {quiz.totalMarks} ({Math.round((score / quiz.totalMarks) * 100)}%)
                </span>
              </div>
            </div>
          )}

          {!isAvailable && !isCompleted && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                <div className="text-sm text-amber-800">
                  {now < startDate
                    ? `This quiz will be available from ${formattedStartDate}.`
                    : `This quiz is no longer available. It ended on ${formattedEndDate}.`}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => setIsQuizModalOpen(true)}
            disabled={!isAvailable && !isCompleted}
            variant={isCompleted ? "outline" : "default"}
            className="w-full"
          >
            {isCompleted ? "View Results" : "Start Quiz"}
          </Button>
        </CardFooter>
      </Card>

      <QuizModal quizId={quiz.id} isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />
    </>
  )
}
