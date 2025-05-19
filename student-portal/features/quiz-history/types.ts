export interface QuizAttempt {
  id: string
  quizId: string
  studentProfileId: string
  startTime: string
  endTime: string | null
  questions: QuizQuestion[]
  answers: Record<string, string> | null
  score: number | null
  isPassed: boolean | null
  status: "in_progress" | "completed" | "timed_out"
  feedback: string | null
  aiAnalysis: any | null
  createdAt: string
  updatedAt: string
  quiz?: Quiz
  studentProfile?: StudentProfile
}

export interface QuizQuestion {
  type: string
  options: string[]
  question: string
  explanation: string
  correctAnswer: string
}

export interface Quiz {
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
  course?: Course
}

export interface Course {
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

export interface StudentProfile {
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
