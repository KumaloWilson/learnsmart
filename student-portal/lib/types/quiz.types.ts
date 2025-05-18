import type { CourseDetails } from "@/lib/types/course.types"

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

export interface AIAnalysis {
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
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
  status: "in_progress" | "completed" | "expired"
  feedback: string | null
  aiAnalysis: AIAnalysis | null
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
    course: CourseDetails
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

export interface QuizSubmission {
  answers: QuizAnswer[]
}

export interface QuizState {
  currentAttempt: QuizAttempt | null
  isLoading: boolean
  error: string | null
  timeRemaining: number | null
  currentQuestionIndex: number
  answers: QuizAnswer[]
  isSubmitting: boolean
  submissionResult: QuizAttempt | null
}
