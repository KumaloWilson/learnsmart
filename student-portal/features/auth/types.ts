export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export interface Department {
  id: string
  name: string
  description: string
  code: string
  schoolId: string
  createdAt: string
  updatedAt: string
}

export interface Course {
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

export interface Program {
  id: string
  name: string
  code: string
  description: string
  durationYears: number
  level: string
  department: Department
  courses: Course[]
}

export interface Semester {
  id: string
  name: string
  startDate: string
  endDate: string
  academicYear: number
}

export interface AcademicRecord {
  id: string
  semesterId: string
  semesterName: string
  academicYear: number
  gpa: number
  cgpa: number
  totalCredits: number
  earnedCredits: number
  remarks: string
}

export interface Enrollment {
  id: string
  courseId: string
  courseName: string
  courseCode: string
  status: string
  grade: string | null
  letterGrade: string | null
  creditHours: number
}

export interface LearningRecommendation {
  id: string
  resourceId: string
  resourceTitle: string
  resourceType: string
  resourceUrl: string
  courseId: string
  courseName: string
  courseCode: string
  relevanceScore: number
  isViewed: boolean
  isSaved: boolean
  isCompleted: boolean
  completedAt: string | null
  rating: number | null
  feedback: string | null
}

export interface StudentProfile {
  id: string
  studentId: string
  status: string
  currentLevel: number
  enrollmentDate: string
  graduationDate: string | null
  dateOfBirth: string
  gender: string
  address: string
  phoneNumber: string
  programId: string
  program: Program
  activeSemester: Semester
  currentSemesterPerformance: AcademicRecord
  academicRecords: AcademicRecord[]
  currentEnrollments: Enrollment[]
  learningRecommendations: LearningRecommendation[]
  notifications: any[]
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
  studentProfile: StudentProfile
}
