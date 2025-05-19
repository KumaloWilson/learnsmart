import axios from "axios"
import { StartQuizRequest, StartQuizResponse, SubmitQuizRequest, SubmitQuizResponse, QuizAttempt } from "../types"

const API_URL = "http://localhost:5000/api"

export const quizService = {
  async startQuiz(data: StartQuizRequest, token: string): Promise<StartQuizResponse> {
    try {
      const response = await axios.post<StartQuizResponse>(`${API_URL}/quizzes/attempts/start`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to start quiz")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async submitQuiz(attemptId: string, data: SubmitQuizRequest, token: string): Promise<SubmitQuizResponse> {
    try {
      const response = await axios.post<SubmitQuizResponse>(`${API_URL}/quizzes/attempts/${attemptId}/submit`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to submit quiz")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async getQuizAttempt(attemptId: string, token: string): Promise<QuizAttempt> {
    try {
      const response = await axios.get<QuizAttempt>(`${API_URL}/quizzes/attempts/${attemptId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to get quiz attempt")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async getStudentQuizAttempts(studentProfileId: string, token: string): Promise<QuizAttempt[]> {
    try {
      const response = await axios.get<QuizAttempt[]>(`${API_URL}/student-portal/${studentProfileId}/quiz-attempts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to get quiz attempts")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
