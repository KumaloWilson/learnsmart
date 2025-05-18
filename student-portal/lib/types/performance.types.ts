// Create a new type definition file for detailed performance data
export interface CoursePerformance {
  id: string
  studentProfileId: string
  courseId: string
  semesterId: string
  attendancePercentage: number
  assignmentAverage: number
  quizAverage: number
  overallPerformance: number
  performanceCategory: "excellent" | "good" | "average" | "poor"
  strengths: string
  weaknesses: string
  recommendations: string
  aiAnalysis: {
    studentName: string
    courseName: string
    attendancePercentage: number
    assignmentAverage: number
    quizAverage: number
    overallPerformance: number
    performanceCategory: string
    assignmentDetails: any[]
    quizDetails: any[]
  }
  lastUpdated: string
  assessmentId: string | null
  quizId: string | null
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

export interface PerformanceState {
  coursePerformance: CoursePerformance[]
  isLoading: boolean
  error: string | null
}
