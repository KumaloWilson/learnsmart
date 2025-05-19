export interface AcademicRecord {
  id: string
  semester: string
  year: string
  courses: CourseRecord[]
  gpa: number
}

export interface CourseRecord {
  courseId: string
  courseName: string
  grade: string
  credits: number
}
