import type { Department } from "./department"
import type { Course } from "./course"

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
  department?: Department
  courses?: Course[]
}

export interface CreateProgramDto {
  name: string
  description: string
  code: string
  durationYears: number
  level: string
  departmentId: string
}

export interface UpdateProgramDto {
  name?: string
  description?: string
  code?: string
  durationYears?: number
  level?: string
  departmentId?: string
}

export const PROGRAM_LEVELS = [
  { value: "undergraduate", label: "Undergraduate" },
  { value: "postgraduate", label: "Postgraduate" },
  { value: "doctorate", label: "Doctorate" },
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma" },
]
