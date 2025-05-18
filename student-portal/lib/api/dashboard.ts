import { api } from "@/lib/redux/api"

export interface DashboardData {
  enrollments: Enrollment[]
  upcomingAssessments: Assessment[]
  upcomingVirtualClasses: VirtualClass[]
  recentMaterials: Material[]
  performanceSummary: PerformanceSummary[]
  attendanceSummary: AttendanceRecord[]
}

export interface Enrollment {
  id: string
  studentProfileId: string
  courseId: string
  semesterId: string
  status: string
  grade: number | null
  letterGrade: string | null
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

export interface Assessment {
  id: string
  title: string
  description: string
  dueDate: string
  type: string
  totalPoints: number
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  course: {
    id: string
    name: string
    code: string
  }
}

export interface VirtualClass {
  id: string
  title: string
  description: string
  scheduledStartTime: string
  scheduledEndTime: string
  meetingId: string
  meetingLink: string
  meetingConfig: {
    passcode: string
    platform: string
  }
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
  lecturerProfile: {
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
    }
  }
}

export interface Material {
  id: string
  title: string
  description: string
  type: string
  url: string
  courseId: string
  semesterId: string
  createdAt: string
  updatedAt: string
  course: {
    id: string
    name: string
    code: string
  }
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
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, string>({
      query: (studentProfileId) => `/student-portal/${studentProfileId}/dashboard`,
      providesTags: ["Dashboard"],
    }),
  }),
})

export const { useGetDashboardQuery } = dashboardApi
