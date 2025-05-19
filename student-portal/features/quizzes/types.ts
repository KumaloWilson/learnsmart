export interface QuizOption {
  value: string
  label: string
}

export interface QuizQuestion {
  type: "multiple_choice" | "true_false" | "short_answer"
  options?: string[]
  question: string
  explanation?: string
  correctAnswer?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  numberOfQuestions: number
  timeLimit: number // in minutes
  startDate: string
  endDate: string
  totalMarks: number
  passingMarks: number
  isActive: boolean
  isRandomized: boolean
  aiPrompt?: {
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
  course?: {
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
  status: "in_progress" | "completed" | "timed_out" | "submitted"
  feedback: string | null
  aiAnalysis: any | null
  createdAt: string
  updatedAt: string
  quiz?: Quiz
  studentProfile?: {
    id: string
    studentId: string
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

export interface StartQuizResponse {
  id: string
  quizId: string
  studentProfileId: string
  startTime: string
  endTime: null
  questions: QuizQuestion[]
  answers: null
  score: null
  isPassed: null
  status: "in_progress"
  feedback: null
  aiAnalysis: null
  createdAt: string
  updatedAt: string
  quiz: Quiz
  studentProfile: {
    id: string
    studentId: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export interface SubmitQuizRequest {
  answers: QuizAnswer[]
}

export interface SubmitQuizResponse {
  id: string
  quizId: string
  studentProfileId: string
  startTime: string
  endTime: string
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  score: number
  isPassed: boolean
  status: "completed" | "timed_out"
  feedback: string | null
  aiAnalysis: any | null
  createdAt: string
  updatedAt: string
}
