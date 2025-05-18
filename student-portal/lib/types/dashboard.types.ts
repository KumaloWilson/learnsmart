export interface MeetingConfig {
  passcode: string
  platform: string
}

export interface LecturerUser {
  firstName: string
  lastName: string
}

export interface LecturerProfile {
  id: string
  staffId: string
  title: string
  specialization: string
  bio: string
  officeLocation: string
  officeHours: string
  phoneNumber: string
  status: string
  joinDate: string
  endDate: string | null
  userId: string
  departmentId: string
  createdAt: string
  updatedAt: string
  user: LecturerUser
}

export interface CourseDetails {
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

export interface SemesterDetails {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  academicYear: number
  createdAt: string
  updatedAt: string
}

export interface EnrollmentDetails {
  id: string
  studentProfileId: string
  courseId: string
  semesterId: string
  status: string
  grade: string | null
  letterGrade: string | null
  createdAt: string
  updatedAt: string
  course: CourseDetails
  semester: SemesterDetails
}

export interface VirtualClassDetails {
  id: string
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  meetingId: string
  meetingLink: string
  meetingConfig: MeetingConfig
  status: string
  actualStartTime: string | null
  actualEndTime: string | null
  duration: number | null
  isRecorded: boolean
  recordingUrl: string | null
  lecturerProfileId: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  course: CourseDetails
  lecturerProfile: LecturerProfile
}

export interface PerformanceAnalysis {
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

export interface PerformanceSummary {
  id: string
  studentProfileId: string
  courseId: string
  semesterId: string
  attendancePercentage: number
  assignmentAverage: number
  quizAverage: number
  overallPerformance: number
  performanceCategory: string
  strengths: string
  weaknesses: string
  recommendations: string
  aiAnalysis: PerformanceAnalysis
  lastUpdated: string
  assessmentId: string | null
  quizId: string | null
  createdAt: string
  updatedAt: string
  course: CourseDetails
}

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
  course: CourseDetails
}

export interface DashboardData {
  enrollments: EnrollmentDetails[]
  upcomingAssessments: any[]
  upcomingVirtualClasses: VirtualClassDetails[]
  recentMaterials: any[]
  performanceSummary: PerformanceSummary[]
  attendanceSummary: AttendanceRecord[]
}
