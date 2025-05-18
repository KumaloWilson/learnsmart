import { apiService } from "./api"
import type { QuizAttempt } from "@/lib/types/quiz-history.types"

export const quizHistoryService = {
  /**
   * Get all quiz attempts for a student
   */
  getQuizAttempts: async (studentId: string, token: string): Promise<QuizAttempt[]> => {
    try {
      return await apiService.request<QuizAttempt[]>(`/student-portal/${studentId}/quiz/attempts`, "GET", null, token)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch quiz attempts")
    }
  },

  /**
   * Get a specific quiz attempt
   */
  getQuizAttempt: async (studentId: string, attemptId: string, token: string): Promise<QuizAttempt> => {
    try {
      return await apiService.request<QuizAttempt>(
        `/student-portal/${studentId}/quiz/attempts/${attemptId}`,
        "GET",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch quiz attempt")
    }
  },
}
