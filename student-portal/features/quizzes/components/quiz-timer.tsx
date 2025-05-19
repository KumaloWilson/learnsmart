"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { Clock, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { setTimeRemaining } from "../redux/quizSlice"

interface QuizTimerProps {
  onTimeExpired: () => void
}

export function QuizTimer({ onTimeExpired }: QuizTimerProps) {
  const dispatch = useAppDispatch()
  const { timeRemaining } = useAppSelector((state) => state.quiz)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    if (timeRemaining === null) return

    // Show warning when less than 2 minutes remain
    setIsWarning(timeRemaining < 120)

    // Set up the timer
    const timer = setInterval(() => {
      if (timeRemaining <= 1) {
        clearInterval(timer)
        onTimeExpired()
      } else {
        dispatch(setTimeRemaining(timeRemaining - 1))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining, dispatch, onTimeExpired])

  if (timeRemaining === null) return null

  // Format time remaining
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  return (
    <div className="space-y-2">
      <div className={`flex items-center gap-2 text-lg font-semibold ${isWarning ? "text-red-500" : "text-primary"}`}>
        <Clock className={`h-5 w-5 ${isWarning ? "animate-pulse" : ""}`} />
        <span>Time Remaining: {formattedTime}</span>
      </div>

      {isWarning && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Less than {minutes === 0 ? "1 minute" : "2 minutes"} remaining! Your quiz will be automatically submitted
            when time expires.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
