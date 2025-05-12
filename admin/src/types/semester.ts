import type { Course } from "./course"
import type { Period } from "./period"

export interface Semester {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  academicYear: number
  createdAt: string
  updatedAt: string
  courses?: Course[]
  periods?: Period[]
}

export interface CreateSemesterDto {
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  academicYear: number
}

export interface UpdateSemesterDto {
  name?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
  academicYear?: number
}
