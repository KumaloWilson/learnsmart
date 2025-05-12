import type { Program } from "./program"
import type { Semester } from "./semester"

export interface Course {
  id: string
  name: string
  description: string
  code: string
  level: string
  creditHours: number
  programId: string
  createdAt: string
  updatedAt: string
  program?: Program
  semesters?: Semester[]
}

export interface CreateCourseDto {
  name: string
  description: string
  code: string
  level: string | number
  creditHours: number
  programId: string
}

export interface UpdateCourseDto {
  name?: string
  description?: string
  code?: string
  level?: string | number
  creditHours?: number
  programId?: string
}

export interface AssignCourseToSemesterDto {
  courseId: string
  semesterId: string
}
