"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, FileText, AlertTriangle } from "lucide-react"
import { QuizModal } from "./quiz-modal"
import { Quiz } from "../types"
import { formatTime } from "@/lib/utils"
import { useAppSelector } from "@/redux/hooks"

interface QuizCardProps {
  quiz: Quiz
  isCompleted?: boolean
  score?: number | null
  isPassed?: boolean | null
}

export function QuizCard({ quiz, isCompleted = false, score = null, isPassed = null }: QuizCardProps) {
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
  
  // Get attempts from Redux store to check if user has already attempted this quiz
  const { attempts } = useAppSelector((state) => state.quiz)
  console.log("attempts",attempts)
  // Check if the user has already attempted this specific quiz
  const hasAttemptedQuiz = attempts.some(attempt => 
    attempt.quizId === quiz.id && 
    (attempt.status === "completed" || attempt.status === "timed_out" || attempt.status === "in_progress")
  )

  // Format dates
  const startDate = new Date(quiz.startDate)
  const endDate = new Date(quiz.endDate)
  
  // Format times using the formatTime function
  const formattedStartTime = formatTime(quiz.startDate) // e.g. "7:36 AM"
  const formattedEndTime = formatTime(quiz.endDate)     // e.g. "8:33 AM"
  
  // Parse the formatted times back to Date objects for calculations
  const parseTimeString = (timeStr: string, dateObj: Date): Date => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    
    // Create a new Date object with the date from dateObj but time from timeStr
    const newDate = new Date(dateObj);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
  };
  
  // Create Date objects based on the formatted times
  // These will be used for calculations
  const calculatedStartDate = parseTimeString(formattedStartTime, startDate);
  const calculatedEndDate = parseTimeString(formattedEndTime, endDate);
  
  // Allow entry 5 minutes before the start time
  const earlyAccessTime = new Date(calculatedStartDate.getTime() - 5 * 60 * 1000)

  useEffect(() => {
    // Function to check availability based on current time
    const checkAvailability = () => {
      const now = new Date()
      
      // Quiz is available if:
      // 1. It's active AND
      // 2. Current time is within formatted time range AND
      // 3. User hasn't completed it yet (unless viewing results)
      const isTimeAvailable = now >= calculatedStartDate && now <= calculatedEndDate && quiz.isActive
      const canAccess = isTimeAvailable && (!hasAttemptedQuiz || isCompleted)
      
      setIsAvailable(canAccess)

      // Calculate time remaining if quiz is ending soon (within 1 hour)
      if (now < calculatedEndDate && calculatedEndDate.getTime() - now.getTime() < 60 * 60 * 1000) {
        const minutesRemaining = Math.floor((calculatedEndDate.getTime() - now.getTime()) / (60 * 1000))
        setTimeRemaining(`${minutesRemaining} minutes remaining`)
      } else {
        setTimeRemaining(null)
      }
    }

    // Check availability immediately and set up interval
    checkAvailability()
    const intervalId = setInterval(checkAvailability, 60000) // Check every minute
    
    return () => clearInterval(intervalId)
  }, [quiz.isActive, quiz.id, calculatedStartDate, calculatedEndDate, earlyAccessTime, hasAttemptedQuiz, isCompleted])

  // Format date ranges
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }

  const formattedStartDate = startDate.toLocaleDateString(undefined, dateOptions)
  const formattedEndDate = endDate.toLocaleDateString(undefined, dateOptions)

  // Get status badge
  const getBadgeStatus = () => {
    if (isCompleted) {
      return {
        variant: isPassed ? "default" : "destructive",
        text: isPassed ? "Passed" : "Failed"
      }
    }
    
    const now = new Date()
    if (now > calculatedEndDate) {
      return { variant: "secondary", text: "Expired" }
    }
    if (now < earlyAccessTime) {
      return { variant: "secondary", text: "Upcoming" }
    }
    if (hasAttemptedQuiz && !isCompleted) {
      return { variant: "secondary", text: "In Progress" }
    }
    return { variant: "default", text: "Available" }
  }

  const badgeStatus = getBadgeStatus()

  return (
    <>
      <Card className="transition-all duration-200 hover:shadow-md" data-quiz-id={quiz.id}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{quiz.title} </CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            <Badge variant={badgeStatus.variant as any}>{badgeStatus.text}</Badge>
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
            <div className="flex flex-col">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {formattedStartDate} - {formattedEndDate} 
                </span>
              </div>
              <div className="flex items-center mt-1 ml-6">
                <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {formattedStartTime} - {formattedEndTime}
                </span>
              </div>
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

          {timeRemaining && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex items-start">
                <Clock className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                <div className="text-sm text-amber-800">
                  {timeRemaining}
                </div>
              </div>
            </div>
          )}

          {!isAvailable && !isCompleted && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                <div className="text-sm text-amber-800">
                  {hasAttemptedQuiz 
                    ? "You have already attempted this quiz."
                    : new Date() < earlyAccessTime
                      ? `This quiz will be available from ${formattedStartDate} at ${formattedStartTime}. You can enter 5 minutes early to prepare.`
                      : `This quiz is no longer available. It ended on ${formattedEndDate} at ${formattedEndTime}.`}
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
            {isCompleted ? "View Results" : hasAttemptedQuiz ? "Continue Quiz" : "Start Quiz"}
          </Button>
        </CardFooter>
      </Card>

      {isQuizModalOpen && (
        <QuizModal 
          quizId={quiz.id} 
          isOpen={isQuizModalOpen} 
          onClose={() => setIsQuizModalOpen(false)} 
        />
      )}
    </>
  )
}