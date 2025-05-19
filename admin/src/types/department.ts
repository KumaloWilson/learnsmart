import type { School } from "./school"

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

export interface Department {
  id: string
  name: string
  description: string
  code: string
  schoolId: string
  createdAt: string
  updatedAt: string
  school?: School
  programs?: Program[]
}

export interface CreateDepartmentDto {
  name: string
  description?: string
  code?: string
  schoolId: string
}

export interface UpdateDepartmentDto {
  name?: string
  description?: string
  code?: string
  schoolId?: string
}
