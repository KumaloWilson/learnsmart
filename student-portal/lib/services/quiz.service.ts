import { apiService } from "./api"
import type { QuizAttempt, QuizSubmission } from "@/lib/types/quiz.types"

export const quizService = {
  /**
   * Start a quiz attempt
   */
  startQuiz: async (quizId: string, studentProfileId: string, token: string): Promise<QuizAttempt> => {
    try {
      return await apiService.request<QuizAttempt>(
        "/quizzes/attempts/start",
        "POST",
        { quizId, studentProfileId },
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to start quiz")
    }
  },

  /**
   * Submit a quiz attempt
   */
  submitQuiz: async (attemptId: string, submission: QuizSubmission, token: string): Promise<QuizAttempt> => {
    try {
      return await apiService.request<QuizAttempt>(`/quizzes/attempts/${attemptId}/submit`, "POST", submission, token)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to submit quiz")
    }
  },
}
