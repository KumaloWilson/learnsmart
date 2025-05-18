export interface AcademicRecord {
  id: string
  studentProfileId: string
  semesterId: string
  gpa: number
  cgpa: number
  totalCredits: number
  earnedCredits: number
  remarks: string
  createdAt: string
  updatedAt: string
  semester: {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
    academicYear: number
    createdAt: string
    updatedAt: string
  }
}

export interface AcademicRecordState {
  academicRecords: AcademicRecord[]
  isLoading: boolean
  error: string | null
}
