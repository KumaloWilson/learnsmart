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
  resetToken?: string
  resetLink?: string
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
  bio?: string
  officeLocation?: string
  officeHours?: string
  phoneNumber?: string
}

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export interface LecturerProfile {
  id: string
  staffId: string
  title: string
  specialization: string
  status: string
  joinDate: string
  departmentId: string
  department: {
    id: string
    name: string
    description: string
    code: string
    schoolId: string
    createdAt: string
    updatedAt: string
  }
  bio: string
  officeLocation: string
  officeHours: string
  phoneNumber: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  user: User
  accessToken: string
  refreshToken: string
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

export interface DashboardData {
  lecturer: {
    id: string
    name: string
    email: string
    specialization: string
  }
  courses: {
    id: string
    name: string
    code: string
    semesterId: string
    semesterName: string
    studentCount: string
  }[]
  upcomingClasses: {
    id: string
    title: string
    courseId: string
    courseName: string
    courseCode: string
    startTime: string
    endTime: string
    meetingLink: string
  }[]
  summary: {
    totalCourses: number
    totalStudents: string
    upcomingClassesCount: number
  }
}

export interface CourseData {
  id: string
  courseId: string
  courseName: string
  courseCode: string
  courseDescription: string
  semesterId: string
  semesterName: string
  studentCount: string
  assignedDate: string
  students?: {
    id: string
    studentId: string
    fullName: string
    email: string
    level: number | string
    status: string
  }[]
}

// New detailed course interface
export interface CourseDetailResponse {
  success: boolean
  data: {
    courseAssignment: {
      id: string
      role: string
      isActive: boolean
      assignedDate: string
    }
    course: {
      id: string
      name: string
      code: string
      description: string
      creditHours: number
      level: number
      program: {
        id: string
        name: string
      }
    }
    semester: {
      id: string
      name: string
      startDate: string
      endDate: string
      isActive: boolean
      academicYear: number
    }
    lecturer: {
      id: string
      fullName: string
      email: string
    }
    otherLecturers: any[]
    enrollmentStats: {
      total: number
      statusCounts: {
        enrolled: number
        completed: number
        failed: number
        withdrawn: number
      }
      averageGrade: number
    }
    students: Array<{
      id: string
      studentId: string
      fullName: string
      email: string
      level: number
      status: string
      grade: number | null
      letterGrade: string | null
    }>
  }
}

export interface MasteryDistribution {
  range: string
  count: number
  percentage: number
}

export interface EngagementDistribution {
  veryHigh: number
  high: number
  moderate: number
  low: number
  veryLow: number
}

export interface StudentEngagement {
  studentProfileId: string
  studentName: string
  studentEmail: string
  physicalAttendanceRate?: number
  virtualAttendanceRate?: number
  overallAttendanceRate: number
  quizCompletionRate: number
  assessmentSubmissionRate: number
  overallEngagement: number
  engagementLevel: string
}

export interface StudentDetail {
  id: string
  studentId: string
  dateOfBirth: string
  gender: string
  address: string
  phoneNumber: string
  status: string
  currentLevel: number
  enrollmentDate: string
  graduationDate: string | null
  userId: string
  programId: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }
  program: {
    id: string
    name: string
    description: string
    code: string
    durationYears: number
    level: string
    departmentId: string
    createdAt: string
    updatedAt: string
    department: {
      id: string
      name: string
      description: string
      code: string
      schoolId: string
      createdAt: string
      updatedAt: string
    }
  }
}

export interface AtRiskStudent {
  id: string
  studentProfileId: string
  courseId: string
  semesterId: string
  riskLevel: string
  riskFactors: string[]
  notes: string
  interventions: string[]
  isResolved: boolean
  lastUpdated: string
  createdAt: string
  updatedAt: string
  studentProfile: {
    id: string
    studentId: string
    currentLevel: number
    status: string
    enrollmentDate: string
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
  }
  course: {
    id: string
    name: string
    code: string
    creditHours?: number
    level?: number
  }
  semester?: {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
    academicYear: number
  }
}

export interface CourseMasteryData {
  courseId: string
  semesterId: string
  totalStudents: number
  distribution: MasteryDistribution[]
  averageMastery: number
  averageQuizScore: number
  averageAssignmentScore: number
  averageTopicCompletion: number
}

export interface StudentEngagementData {
  courseId: string
  semesterId: string
  studentCount: number
  studentEngagement: StudentEngagement[]
  classAverages: {
    physicalAttendanceRate?: number
    virtualAttendanceRate?: number
    overallAttendanceRate: number
    quizCompletionRate: number
    assessmentSubmissionRate: number
    overallEngagement: number
  }
  engagementDistribution: EngagementDistribution
  topEngagedStudents: StudentEngagement[]
  leastEngagedStudents: StudentEngagement[]
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
  recordingUrl: string | null
  status: string
  lecturerProfileId: string
  courseId: string
  semesterId: string
  course: {
    code: string
    name: string
  } | null
  semester: {
    name: string
  } | null
  meetingConfig: {
    platform: string
    passcode: string
  }
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
    platform?: string
    passcode?: string
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

export interface QuizFilterDto {
  lecturerProfileId: string
  courseId?: string
  semesterId?: string
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
  lecturerProfileId: string
  courseId: string
  semesterId: string
  course?: {
    code: string
  }
  semester?: {
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
  title?: string
  description?: string
  topic?: string
  numberOfQuestions?: number
  timeLimit?: number
  startDate?: string
  endDate?: string
  totalMarks?: number
  passingMarks?: number
  isActive?: boolean
  isRandomized?: boolean
  aiPrompt?: {
    difficulty?: string
    focus?: string
  }
  questionType?: string
  instructions?: string
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
  quizId: string
  startTime: string
  endTime: string | null
  score: number | null
  status: string
  studentProfile: {
    studentId: string
    user: {
      firstName: string
      lastName: string
    }
  }
}

// Course Topic interfaces
export interface Semester {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  academicYear: number
  createdAt: string
  updatedAt: string
}

export interface CourseTopic {
  id: string
  title: string
  description: string
  orderIndex: number
  durationHours: number
  learningObjectives: string[]
  keywords: string[]
  difficulty: string
  isActive: boolean
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  course?: {
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
  semester?: {
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

export interface CreateTopicPayload {
  title: string
  description: string
  orderIndex: number
  durationHours: number
  learningObjectives: string[]
  keywords: string[]
  difficulty: string
  isActive: boolean
  courseId: string
  semesterId: string
}

export interface UpdateTopicPayload {
  title?: string
  description?: string
  orderIndex?: number
  durationHours?: number
  learningObjectives?: string[]
  keywords?: string[]
  difficulty?: string
  isActive?: boolean
}

// Course Progress interfaces
export interface TopicProgressStatistics {
  topicId: string
  title: string
  completionRate: number
  averageMasteryLevel: number
  averageTimeSpent: number
  difficulty: string
}

export interface StudentTopicProgress {
  topics: CourseTopic[]
  progress: {
    topicId: string
    isCompleted: boolean
    masteryLevel: number
    timeSpentMinutes: number
    lastAccessedAt: string
  }[]
  completionPercentage: number
}

export interface CourseMasteryStatistics {
  courseId: string
  semesterId: string
  totalStudents: number
  averageMastery: number
  highestMastery: number
  lowestMastery: number
  medianMastery: number
  studentsAbove80Percent: number
  studentsBelow40Percent: number
}

export interface StudentMastery {
  studentId: string
  studentName: string
  masteryLevel: number
  lastUpdated: string
}

// Attendance interfaces
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
  lecturerProfile?: {
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
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
  course?: {
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
  semester?: {
    id: string
    name: string
    startDate: string
    endDate: string
    isActive: boolean
    academicYear: number
    createdAt: string
    updatedAt: string
  }
  studentProfile?: {
    id: string
    studentId: string
    dateOfBirth: string
    gender: string
    address: string
    phoneNumber: string
    status: string
    currentLevel: number
    enrollmentDate: string
    graduationDate: string | null
    userId: string
    programId: string
    createdAt: string
    updatedAt: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
}

export interface AttendanceFilters {
  courseId?: string
  semesterId?: string
  studentProfileId?: string
  isPresent?: boolean
  lecturerProfileId?: string
  startDate?: string
  endDate?: string
}

export interface StudentAttendanceRecord {
  studentProfileId: string
  isPresent: boolean
  notes?: string
}

export interface CreateAttendanceRequest {
  courseId: string
  semesterId: string
  date: string
  topic: string
  notes?: string
  lecturerProfileId: string
  attendanceRecords: StudentAttendanceRecord[]
}

export interface BulkCreateAttendanceRequest {
  attendances: CreateAttendanceRequest[]
}

export interface UpdateAttendanceRequest {
  date?: string
  topic?: string
  notes?: string
  isPresent?: boolean
}

export interface AttendanceStatistics {
  totalClasses: number
  presentCount: number
  absentCount: number
  attendanceRate: number
}

export interface StudentAttendanceSummary {
  studentId: string
  studentName: string
  totalClasses: number
  presentCount: number
  absentCount: number
  attendanceRate: number
}

export interface CourseAttendanceSummary {
  courseId: string
  courseName: string
  courseCode: string
  totalClasses: number
  averageAttendanceRate: number
  studentSummaries: StudentAttendanceSummary[]
}
