import { axiosInstance } from "./axios-instance"
import { handleApiResponse, handleApiError } from "./axios-instance"

export interface DashboardStatsDto {
  totalStudents: number
  totalLecturers: number
  totalCourses: number
  totalPrograms: number
  totalDepartments: number
  totalSchools: number
  activeStudents: number
  activeLecturers: number
  recentEnrollments: number
  upcomingAssessments: number
}

export interface EnrollmentStatsDto {
  totalEnrollments: number
  enrollmentsByProgram: Array<{
    programId: string
    programName: string
    count: number
  }>
  enrollmentsByLevel: Array<{
    level: number
    count: number
  }>
  enrollmentTrend: Array<{
    period: string
    count: number
  }>
}

export interface AcademicPerformanceDto {
  averageGpa: number
  performanceByProgram: Array<{
    programId: string
    programName: string
    averageGpa: number
  }>
  performanceByLevel: Array<{
    level: number
    averageGpa: number
  }>
  performanceTrend: Array<{
    period: string
    averageGpa: number
  }>
}

export interface UserActivityDto {
  newUsers: number
  activeUsers: number
  usersByRole: Array<{
    role: string
    count: number
  }>
  activityTrend: Array<{
    period: string
    count: number
  }>
}

export interface CourseStatsDto {
  totalCourses: number
  activeCourses: number
  coursesByProgram: Array<{
    programId: string
    programName: string
    count: number
  }>
  coursesByLevel: Array<{
    level: number
    count: number
  }>
  popularCourses: Array<{
    courseId: string
    courseName: string
    enrollmentCount: number
  }>
}

export interface RecentActivityDto {
  recentEnrollments: Array<{
    id: string
    studentProfile: {
      user: {
        firstName: string
        lastName: string
      }
    }
    course: {
      name: string
    }
    createdAt: string
  }>
  recentAssessments: Array<{
    id: string
    title: string
    course: {
      name: string
    }
    lecturerProfile: {
      user: {
        firstName: string
        lastName: string
      }
    }
    createdAt: string
  }>
  recentUsers: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    createdAt: string
  }>
}

export interface UpcomingEventsDto {
  upcomingAssessments: Array<{
    id: string
    title: string
    dueDate: string
    course: {
      name: string
    }
  }>
}

export interface SystemHealthDto {
  status: string
  uptime: number
  memoryUsage: any
  databaseConnections: number
  activeUsers: number
  apiRequests: {
    total: number
    successful: number
    failed: number
  }
  lastBackup: string
}

export interface AllDashboardDataDto {
  overview: DashboardStatsDto
  enrollments: EnrollmentStatsDto
  performance: AcademicPerformanceDto
  userActivity: UserActivityDto
  courseStats: CourseStatsDto
  recentActivity: RecentActivityDto
  upcomingEvents: UpcomingEventsDto
}

// API calls matching the new endpoints
export const dashboardApi = {
  getOverviewStats: async (): Promise<DashboardStatsDto> => {
    try {
      const response = await axiosInstance.get<DashboardStatsDto>("/dashboard/overview")
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getEnrollmentStats: async (): Promise<EnrollmentStatsDto> => {
    try {
      const response = await axiosInstance.get<EnrollmentStatsDto>("/dashboard/enrollments")
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getAcademicPerformance: async (): Promise<AcademicPerformanceDto> => {
    try {
      const response = await axiosInstance.get<AcademicPerformanceDto>("/dashboard/performance")
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getUserActivity: async (): Promise<UserActivityDto> => {
    try {
      const response = await axiosInstance.get<UserActivityDto>("/dashboard/user-activity")
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getCourseStats: async (): Promise<CourseStatsDto> => {
    try {
      const response = await axiosInstance.get<CourseStatsDto>("/dashboard/courses")
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getRecentActivity: async (limit = 10): Promise<RecentActivityDto> => {
    try {
      const response = await axiosInstance.get<RecentActivityDto>(`/dashboard/recent-activity?limit=${limit}`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getUpcomingEvents: async (days = 7): Promise<UpcomingEventsDto> => {
    try {
      const response = await axiosInstance.get<UpcomingEventsDto>(`/dashboard/upcoming-events?days=${days}`)
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getSystemHealth: async (): Promise<SystemHealthDto> => {
    try {
      const response = await axiosInstance.get<SystemHealthDto>("/dashboard/system-health")
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },
  
  getAllDashboardData: async (): Promise<AllDashboardDataDto> => {
    try {
      const response = await axiosInstance.get<AllDashboardDataDto>("/dashboard/all")
      return handleApiResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  }
}