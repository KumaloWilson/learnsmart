"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

interface QuizNavigationProps {
  currentQuestion: number
  totalQuestions: number
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function QuizNavigation({
  currentQuestion,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
}: QuizNavigationProps) {
  const isFirstQuestion = currentQuestion === 0
  const isLastQuestion = currentQuestion === totalQuestions - 1

  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstQuestion || isSubmitting}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="text-sm font-medium">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>

      {isLastQuestion ? (
        <Button onClick={onSubmit} disabled={isSubmitting} className="flex items-center gap-1">
          {isSubmitting ? "Submitting..." : "Submit Quiz"}
          <Save className="h-4 w-4 ml-1" />
        </Button>
      ) : (
        <Button variant="outline" onClick={onNext} disabled={isSubmitting} className="flex items-center gap-1">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
