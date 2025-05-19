export interface PerformanceData {
  overallGrade: number
  coursePerformance: CoursePerformance[]
  strengths: string[]
  areasForImprovement: string[]
}

export interface CoursePerformance {
  courseId: string
  courseName: string
  grade: number
  progress: number
}
