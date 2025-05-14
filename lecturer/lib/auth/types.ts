export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  lecturerProfile: LecturerProfile
  accessToken: string
  refreshToken: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface UpdateProfileRequest {
  firstName: string
  lastName: string
  bio: string
  officeLocation: string
  officeHours: string
  phoneNumber: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  departmentId: string
}

export interface LecturerProfile {
  id: string
  title: string
  bio: string
  specialization: string
  officeLocation: string
  officeHours: string
  phoneNumber: string
  department: {
    id: string
    name: string
  }
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface QuizFilterDto {
  courseId?: string
  semesterId?: string
  lecturerProfileId?: string
  isActive?: boolean
  search?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  topic: string
  numberOfQuestions: number
  timeLimit: number
  startDate: string
  endDate: string
  totalMarks: number
  passingMarks: number
  isActive: boolean
  isRandomized: boolean
  aiPrompt: {
    difficulty: string
    focus: string
  }
  questionType: string
  instructions: string
  course: {
    id: string
    code: string
    name: string
  }
  semester: {
    id: string
    name: string
  }
}

export interface CreateQuizRequest {
  title: string
  description: string
  topic: string
  numberOfQuestions: number
  timeLimit: number
  startDate: string
  endDate: string
  totalMarks: number
  passingMarks: number
  isActive: boolean
  isRandomized: boolean
  aiPrompt: {
    difficulty: string
    focus: string
  }
  questionType: string
  instructions: string
  lecturerProfileId: string
  courseId: string
  semesterId: string
}

export interface UpdateQuizRequest {
  title: string
  description: string
  topic: string
  numberOfQuestions: number
  timeLimit: number
  startDate: string
  endDate: string
  totalMarks: number
  passingMarks: number
  isActive: boolean
  isRandomized: boolean
  aiPrompt: {
    difficulty: string
    focus: string
  }
  questionType: string
  instructions: string
}

export interface QuizStatistics {
  totalStudents: number
  attemptedCount: number
  averageScore: number
  passRate: number
  highestScore: number
  lowestScore: number
  medianScore: number
}

export interface QuizAttempt {
  id: string
  studentProfileId: string
  startTime: string
  endTime: string | null
  score: number | null
  status: string
  studentProfile: {
    studentId: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export interface DashboardData {
  lecturer: {
    name: string
  }
  summary: {
    totalCourses: number
    totalStudents: number
    upcomingClassesCount: number
  }
  courses: CourseData[]
  upcomingClasses: UpcomingClass[]
}

export interface CourseData {
  id: string
  courseCode: string
  courseName: string
  studentCount: number
  semesterName: string
  courseId: string
  semesterId: string
  assignedDate: string
  courseDescription: string
  students: Student[]
}

export interface Student {
  id: string
  studentId: string
  fullName: string
  email: string
  level: string
  status: string
}

export interface UpcomingClass {
  id: string
  title: string
  courseCode: string
  startTime: string
  endTime: string
  meetingLink: string
}

export interface StudentDetail {
  id: string
  studentId: string
  firstName: string
  lastName: string
  email: string
  level: string
  status: string
}

export interface AtRiskStudent {
  id: string
  studentProfile: {
    id: string
    studentId: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
  course: {
    id: string
    code: string
    name: string
  }
  riskLevel: string
  riskFactors: string[]
  lastUpdated: string
  isResolved: boolean
}

export interface CourseMasteryData {
  averageMastery: number
  averageQuizScore: number
  averageAssignmentScore: number
  averageTopicCompletion: number
  distribution: MasteryDistribution[]
}

export interface StudentEngagementData {
  classAverages: {
    overallAttendanceRate: number
    quizCompletionRate: number
    assessmentSubmissionRate: number
  }
  engagementDistribution: EngagementDistribution
  studentEngagement: StudentEngagement[]
}

export interface VirtualClass {
  id: string
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  actualStartTime: string | null
  actualEndTime: string | null
  duration: number | null
  isRecorded: boolean
  meetingId: string
  meetingLink: string
  status: string
  courseId: string
  semesterId: string
  lecturerProfileId: string
  meetingConfig: {
    platform: string
    passcode: string
  }
  course?: {
    code: string
    name: string
  }
  semester?: {
    name: string
  }
  recordingUrl?: string
}

export interface CreateVirtualClassRequest {
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  isRecorded: boolean
  lecturerProfileId: string
  courseId: string
  semesterId: string
  meetingConfig: {
    platform: string
    passcode: string
  }
}

export interface UpdateVirtualClassRequest {
  title?: string
  description?: string
  scheduledStartTime?: string
  scheduledEndTime?: string
  actualStartTime?: string
  actualEndTime?: string
  duration?: number
  isRecorded?: boolean
  status?: string
  meetingConfig?: {
    platform: string
    passcode: string
  }
  recordingUrl?: string
}

export interface VirtualClassAttendance {
  id: string
  studentProfileId: string
  virtualClassId: string
  joinTime: string | null
  leaveTime: string | null
  durationMinutes: number | null
  isPresent: boolean
  notes: string | null
  studentProfile: {
    studentId: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export interface VirtualClassAttendanceStatistics {
  totalStudents: number
  presentStudents: number
  absentStudents: number
  attendancePercentage: number
}

export interface AuthState {
  user: User | null
  lecturerProfile: LecturerProfile | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
