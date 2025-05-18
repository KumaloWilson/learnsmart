export interface QuizAttemptQuestion {
  type: string
  options: string[]
  question: string
  explanation: string
  correctAnswer: string
}

export interface QuizAttemptAnswer {
  type: string
  questionIndex: number
  selectedOption: string
}

export interface QuizAttemptQuestionResult {
  question: string
  isCorrect: boolean
  userAnswer: QuizAttemptAnswer
  explanation: string
}

export interface QuizAttemptAIAnalysis {
  score: number
  isPassed: boolean
  strengths: string[]
  totalMarks: number
  weaknesses: string[]
  correctAnswers: number
  totalQuestions: number
  questionResults: QuizAttemptQuestionResult[]
  recommendations: string[]
  percentageCorrect: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentProfileId: string
  startTime: string
  endTime: string
  questions: QuizAttemptQuestion[]
  answers: QuizAttemptAnswer[]
  score: number
  isPassed: boolean
  status: string
  feedback: string
  aiAnalysis: QuizAttemptAIAnalysis
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

export interface QuizHistoryState {
  quizAttempts: QuizAttempt[]
  isLoading: boolean
  error: string | null
}
