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
  course: {
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
