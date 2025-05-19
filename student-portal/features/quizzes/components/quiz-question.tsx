"use client"

import { useState, useEffect } from "react"
import { useAppDispatch } from "@/redux/hooks"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QuizAnswer, QuizQuestion } from "../types"
import { updateAnswer } from "../redux/quizSlice"

interface QuizQuestionProps {
  question: QuizQuestion
  questionIndex: number
  currentAnswer?: string
}

export function QuizQuestionComponent({ question, questionIndex, currentAnswer }: QuizQuestionProps) {
  const dispatch = useAppDispatch()
  const [selectedOption, setSelectedOption] = useState<string | undefined>(currentAnswer)

  useEffect(() => {
    if (currentAnswer) {
      setSelectedOption(currentAnswer)
    }
  }, [currentAnswer])

  const handleOptionChange = (value: string) => {
    setSelectedOption(value)

    const answer: QuizAnswer = {
      questionIndex,
      selectedOption: value,
      type: question.type,
    }

    dispatch(updateAnswer(answer))
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Question {questionIndex + 1}: {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {question.type === "multiple_choice" && question.options && (
          <RadioGroup value={selectedOption} onValueChange={handleOptionChange} className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`q${questionIndex}-option-${index}`} />
                <Label htmlFor={`q${questionIndex}-option-${index}`} className="text-base">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  )
}
