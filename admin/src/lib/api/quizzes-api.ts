import { AxiosResponse } from "axios"
import axiosInstance from "./axios-instance"


export interface Quiz {
  id: string
  title: string
  description?: string
  courseId: string
  courseName?: string
  startTime: string
  endTime: string
  duration: number
  totalMarks: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface QuizQuestion {
  id: string
  quizId: string
  question: string
  questionType: string
  marks: number
  order: number
}

export interface QuizOption {
  id: string
  questionId: string
  text: string
  isCorrect: boolean
  order: number
}

export interface CreateQuizDto {
  title: string
  description?: string
  courseId: string
  startTime: string
  endTime: string
  duration: number
  totalMarks: number
  isPublished: boolean
}

export interface UpdateQuizDto {
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  duration?: number
  totalMarks?: number
  isPublished?: boolean
}

export interface CreateQuizQuestionDto {
  quizId: string
  question: string
  questionType: string
  marks: number
  order: number
  options?: CreateQuizOptionDto[]
}

export interface CreateQuizOptionDto {
  text: string
  isCorrect: boolean
  order: number
}

export const quizzesApi = {
  getQuizzes: () => {
    return axiosInstance.get("/quizzes")
  },
  getQuizzesByCourse: (courseId: string) => {
    return axiosInstance.get(`/courses/${courseId}/quizzes`)
  },
  getQuizById: (id: string) => {
    return axiosInstance.get(`/quizzes/${id}`)
  },
  createQuiz: (quizData: Omit<Quiz, "id">) => {
    return axiosInstance.post("/quizzes", quizData)
  },
  updateQuiz: (id: string, quizData: Partial<Quiz>) => {
    return axiosInstance.put(`/quizzes/${id}`, quizData)
  },
  deleteQuiz: (id: string) => {
    return axiosInstance.delete(`/quizzes/${id}`)
  },
  publishQuiz: (id: string) => {
    return axiosInstance.patch(`/quizzes/${id}/publish`)
  },
  addQuizQuestion: (quizId: string, questionData: Omit<QuizQuestion, "id" | "quizId">) => {
    return axiosInstance.post(`/quizzes/${quizId}/questions`, questionData)
  },
  updateQuizQuestion: (questionId: string, questionData: Partial<QuizQuestion>) => {
    return axiosInstance.put(`/quiz-questions/${questionId}`, questionData)
  },
  deleteQuizQuestion: (questionId: string) => {
    return axiosInstance.delete(`/quiz-questions/${questionId}`)
  },
  getQuizAttempts: (quizId: string) => {
    return axiosInstance.get(`/quizzes/${quizId}/attempts`)
  },
  getQuizAttemptById: (attemptId: string) => {
    return axiosInstance.get(`/quiz-attempts/${attemptId}`)
  },
}

// Get question options
export const getQuestionOptions = async (questionId: string): Promise<QuizOption[]> => {
  const response = await axiosInstance.get<QuizOption[]>(`/quiz-questions/${questionId}/options`)
  return response.data
}
function handleApiResponse(response: AxiosResponse<QuizOption[], any>): QuizOption[] | PromiseLike<QuizOption[]> {
  throw new Error("Function not implemented.")
}

