export interface Department {
  id: string
  name: string
  description: string
  code: string
  schoolId: string
  createdAt: string
  updatedAt: string
}

export interface School {
  id: string
  name: string
  description: string
  code: string
  createdAt: string
  updatedAt: string
  departments?: Department[]
}

export interface CreateSchoolDto {
  name: string
  description: string
  code: string
}

export interface UpdateSchoolDto {
  name?: string
  description?: string
  code?: string
}
