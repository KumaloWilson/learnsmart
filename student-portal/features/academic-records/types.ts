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
  courses?: CourseRecord[]
}

export interface CourseRecord {
  courseId: string
  courseName: string
  grade: string
  credits: number
}
