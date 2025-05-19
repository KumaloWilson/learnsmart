// Course list types
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

export interface Enrollment {
  id: string
  courseId: string
  courseName: string
  courseCode: string
  status: string
  grade: string | null
  letterGrade: string | null
  creditHours: number
}

// Course details types
export interface CourseDetails {
  course: CourseInfo
  materials: Material[]
  assessments: Assessment[]
  submissions: Submission[]
  quizzes: Quiz[]
  quizAttempts: QuizAttempt[]
  virtualClasses: VirtualClass[]
  attendance: AttendanceRecord[]
}

export interface CourseInfo {
  id: string
  name: string
  description: string
  code: string
  level: number
  creditHours: number
  programId: string
  createdAt: string
  updatedAt: string
  program: Program
}

export interface Program {
  id: string
  name: string
  description: string
  code: string
  durationYears: number
  level: string
  departmentId: string
  createdAt: string
  updatedAt: string
}

export interface Material {
  id: string
  title: string
  description: string
  type: string
  url: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
}

export interface Assessment {
  id: string
  title: string
  description: string
  dueDate: string
  type: string
  totalMarks: number
  weight: number
  status: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  assessmentId: string
  studentProfileId: string
  submissionDate: string
  status: string
  grade: number | null
  feedback: string | null
  files: string[]
  createdAt: string
  updatedAt: string
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
  lecturerProfile: LecturerProfile
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentProfileId: string
  startTime: string
  endTime: string
  questions: QuizQuestion[]
  answers: QuizAnswer[]
  score: number
  isPassed: boolean
  status: string
  feedback: string
  aiAnalysis: QuizAIAnalysis
  createdAt: string
  updatedAt: string
  quiz: Quiz
}

export interface QuizQuestion {
  type: string
  options?: string[]
  question: string
  explanation: string
  correctAnswer: string
}

export interface QuizAnswer {
  type: string
  questionIndex: number
  selectedOption?: string
  textAnswer?: string
}

export interface QuizAIAnalysis {
  score: number
  isPassed: boolean
  strengths: string[]
  totalMarks: number
  weaknesses: string[]
  correctAnswers: number
  totalQuestions: number
  questionResults: QuestionResult[]
  recommendations: string[]
  percentageCorrect: number
}

export interface QuestionResult {
  question: string
  isCorrect: boolean
  userAnswer: QuizAnswer
  explanation: string
}

export interface VirtualClass {
  id: string
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  meetingId: string
  meetingLink: string
  meetingConfig: {
    passcode: string
    platform: string
  }
  status: string
  actualStartTime: string | null
  actualEndTime: string | null
  duration: number | null
  isRecorded: boolean
  recordingUrl: string | null
  lecturerProfileId: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  lecturerProfile: LecturerProfile
}

export interface LecturerProfile {
  id: string
  staffId: string
  title: string
  specialization: string
  bio: string
  officeLocation: string
  officeHours: string
  phoneNumber: string
  status: string
  joinDate: string
  endDate: string | null
  userId: string
  departmentId: string
  createdAt: string
  updatedAt: string
  user: {
    firstName: string
    lastName: string
  }
}

export interface AttendanceRecord {
  id: string
  date: string
  topic: string
  notes: string
  lecturerProfileId: string
  courseId: string
  semesterId: string
  studentProfileId: string
  isPresent: boolean
  createdAt: string
  updatedAt: string
}

// Course topics types
export interface CourseTopic {
  id: string
  title: string
  description: string
  orderIndex: number
  durationHours: number
  learningObjectives: string[]
  keywords: string[]
  difficulty: string
  isActive: boolean
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
}
