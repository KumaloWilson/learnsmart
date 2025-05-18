"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react"
import type { QuizAttempt } from "@/lib/types/quiz.types"

interface QuizInstructionsProps {
  attempt: QuizAttempt
  onStart: () => void
}

export function QuizInstructions({ attempt, onStart }: QuizInstructionsProps) {
  const { quiz } = attempt

  return (
    <div className="flex flex-col gap-6 w-full h-full animate-in fade-in-50 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
        <p className="text-muted-foreground">{quiz.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Overview</CardTitle>
          <CardDescription>Please review the following information before starting</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">Questions</span>
              </div>
              <p>{quiz.numberOfQuestions} questions</p>
            </div>
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Time Limit</span>
              </div>
              <p>{quiz.timeLimit} minutes</p>
            </div>
            <div className="flex flex-col gap-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="font-medium">Passing Score</span>
              </div>
              <p>{quiz.passingMarks}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Instructions</h3>
            <p className="text-sm text-muted-foreground">{quiz.instructions}</p>
          </div>

          <div className="rounded-lg border p-4 bg-amber-50 dark:bg-amber-950/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800 dark:text-amber-500">Important Notes</h4>
                <ul className="mt-1 text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
                  <li>Once you start the quiz, the timer will begin and cannot be paused.</li>
                  <li>If you leave the page, your answers will be saved and you can continue where you left off.</li>
                  <li>Submit your quiz before the time expires or your answers will be automatically submitted.</li>
                  <li>You can navigate between questions using the navigation buttons or question numbers.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size="lg" onClick={onStart}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
