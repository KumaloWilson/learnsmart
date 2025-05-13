import type { User } from "./auth"
import type { Program } from "./program"
import type { Course } from "./course"
import type { Semester } from "./semester"

export interface Student {
  id: string
  studentId: string
  dateOfBirth: string | null
  gender: string | null
  address: string | null
  phoneNumber: string | null
  status: "active" | "inactive" | "graduated" | "suspended"
  currentLevel: number
  enrollmentDate: string
  graduationDate: string | null
  userId: string
  programId: string
  createdAt: string
  updatedAt: string
  user?: User
  program?: Program & {
    department?: {
      id: string
      name: string
      description: string
      code: string
      schoolId: string
      createdAt: string
      updatedAt: string
    }
  }
}

export interface StudentFormData {
  firstName: string
  lastName: string
  email: string
  studentId: string
  dateOfBirth?: string
  gender?: string
  address?: string
  phoneNumber?: string
  programId: string
  enrollmentDate: string
  currentLevel: number
  status?: "active" | "inactive" | "graduated" | "suspended"
}

export interface Enrollment {
  id: string
  studentProfileId: string
  courseId: string
  semesterId: string
  status: "enrolled" | "completed" | "failed" | "withdrawn"
  grade: number | null
  letterGrade: string | null
  createdAt: string
  updatedAt: string
  course?: Course & {
    program?: Program
  }
  semester?: Semester
}

export interface EnrollmentFormData {
  studentProfileId: string
  courseId: string
  semesterId: string
  status?: "enrolled" | "completed" | "failed" | "withdrawn"
  grade?: number
}

export interface AcademicRecord {
  id: string
  studentProfileId: string
  semesterId: string
  gpa: number
  cgpa: number
  totalCredits: number
  earnedCredits: number
  remarks: string | null
  createdAt: string
  updatedAt: string
  semester?: Semester
  studentProfile?: Student & {
    user?: {
      firstName: string
      lastName: string
      email: string
    }
    program?: Program
  }
}

export interface AcademicRecordFormData {
  studentProfileId: string
  semesterId: string
  gpa: number
  cgpa: number
  totalCredits: number
  earnedCredits: number
  remarks?: string
}
