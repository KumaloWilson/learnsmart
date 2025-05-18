import type { LecturerProfile } from "@/lib/types/dashboard.types"

export interface CourseProgram {
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

export interface CourseDetails {
  id: string
  name: string
  description: string
  code: string
  level: number
  creditHours: number
  programId: string
  createdAt: string
  updatedAt: string
  program: CourseProgram
}

export interface AIPrompt {
  focus: string
  difficulty: string
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
  aiPrompt: AIPrompt
  questionType: string
  instructions: string
  lecturerProfileId: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  lecturerProfile: LecturerProfile
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

export interface CourseData {
  course: CourseDetails
  materials: any[]
  assessments: any[]
  submissions: any[]
  quizzes: Quiz[]
  quizAttempts: any[]
  virtualClasses: any[]
  attendance: AttendanceRecord[]
}

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
