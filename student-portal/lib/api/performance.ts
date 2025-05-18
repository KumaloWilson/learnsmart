import { api } from "@/lib/redux/api"

export interface StudentPerformance {
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
}

export const performanceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStudentPerformance: builder.query<
      StudentPerformance[],
      { studentId: string; courseId: string; semesterId: string }
    >({
      query: ({ studentId, courseId, semesterId }) =>
        `/student-portal/${studentId}/performance/course/${courseId}/semester/${semesterId}`,
      providesTags: (result, error, { courseId }) => [{ type: "Performance", id: courseId }],
    }),

    getStudentAttendance: builder.query<AttendanceRecord[], string>({
      query: (studentId) => `/student-portal/${studentId}/attendance`,
      providesTags: ["Attendance"],
    }),

    getAcademicRecords: builder.query<AcademicRecord[], string>({
      query: (studentId) => `/student-portal/${studentId}/academic-records`,
      providesTags: ["AcademicRecords"],
    }),
  }),
})

export const { useGetStudentPerformanceQuery, useGetStudentAttendanceQuery, useGetAcademicRecordsQuery } =
  performanceApi
