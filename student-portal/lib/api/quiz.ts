import { api } from "@/lib/redux/api"

export interface QuizQuestion {
  type: string
  options: string[]
  question: string
  explanation: string
  correctAnswer: string
}

export interface QuizAnswer {
  questionIndex: number
  selectedOption: string
  type: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentProfileId: string
  startTime: string
  endTime: string | null
  questions: QuizQuestion[]
  answers: QuizAnswer[] | null
  score: number | null
  isPassed: boolean | null
  status: "not_started" | "in_progress" | "completed" | "timed_out"
  feedback: string | null
  aiAnalysis: {
    score: number
    isPassed: boolean
    strengths: string[]
    totalMarks: number
    weaknesses: string[]
    correctAnswers: number
    totalQuestions: number
    questionResults: {
      question: string
      isCorrect: boolean
      userAnswer: QuizAnswer
      explanation: string
    }[]
    recommendations: string[]
    percentageCorrect: number
  } | null
  createdAt: string
  updatedAt: string
  quiz: {
    id: string
    title: string
    description: string
    topic: string
    numberOfQuestions: number
    timeLimit: number
    startDate: string
    endDate: string
    totalMarks: number
    passingMarks: number
    isActive: boolean
    isRandomized: boolean
    aiPrompt: {
      focus: string
      difficulty: string
    }
    questionType: string
    instructions: string
    lecturerProfileId: string
    courseId: string
    semesterId: string
    createdAt: string
    updatedAt: string
    course: {
      id: string
      name: string
      description: string
      code: string
      level: number
      creditHours: number
      programId: string
      createdAt: string
      updatedAt: string
    }
  }
  studentProfile: {
    id: string
    studentId: string
    dateOfBirth: string
    gender: string
    address: string
    phoneNumber: string
    status: string
    currentLevel: number
    enrollmentDate: string
    graduationDate: string | null
    userId: string
    programId: string
    createdAt: string
    updatedAt: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export interface StartQuizRequest {
  quizId: string
  studentProfileId: string
}

export interface SubmitQuizRequest {
  answers: QuizAnswer[]
}

export interface QuizAttemptFilter {
  quizId?: string
  status?: string
  startDate?: string
  endDate?: string
}

export const quizApi = api.injectEndpoints({
  endpoints: (builder) => ({
    startQuiz: builder.mutation<QuizAttempt, StartQuizRequest>({
      query: (body) => ({
        url: `/quizzes/attempts/start`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quizzes", "QuizAttempts"],
    }),

    submitQuiz: builder.mutation<QuizAttempt, { attemptId: string; answers: QuizAnswer[] }>({
      query: ({ attemptId, answers }) => ({
        url: `/quizzes/attempts/${attemptId}/submit`,
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: ["Quizzes", "QuizAttempts"],
    }),

    getQuizAttempt: builder.query<QuizAttempt, string>({
      query: (attemptId) => `/quizzes/attempts/${attemptId}`,
      providesTags: (result, error, attemptId) => [{ type: "QuizAttempts", id: attemptId }],
    }),

    getQuizAttempts: builder.query<QuizAttempt[], { studentProfileId: string; filters?: QuizAttemptFilter }>({
      query: ({ studentProfileId, filters }) => {
        // Build query parameters
        const params = new URLSearchParams()

        // Always include studentProfileId
        params.append("studentProfileId", studentProfileId)

        // Add optional filters if provided
        if (filters?.quizId) params.append("quizId", filters.quizId)
        if (filters?.status) params.append("status", filters.status)
        if (filters?.startDate) params.append("startDate", filters.startDate)
        if (filters?.endDate) params.append("endDate", filters.endDate)

        return {
          url: `/quizzes/attempts?${params.toString()}`,
        }
      },
      providesTags: ["QuizAttempts"],
    }),

    getQuizAttemptsForQuiz: builder.query<QuizAttempt[], { quizId: string; studentProfileId: string }>({
      query: ({ quizId, studentProfileId }) => {
        const params = new URLSearchParams()
        params.append("quizId", quizId)
        params.append("studentProfileId", studentProfileId)

        return {
          url: `/quizzes/${quizId}/attempts?${params.toString()}`,
        }
      },
      providesTags: (result, error, { quizId }) => [{ type: "QuizAttempts", id: quizId }],
    }),
  }),
})

export const {
  useStartQuizMutation,
  useSubmitQuizMutation,
  useGetQuizAttemptQuery,
  useGetQuizAttemptsQuery,
  useGetQuizAttemptsForQuizQuery,
} = quizApi
