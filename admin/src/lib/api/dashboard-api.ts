import axiosInstance, { handleApiResponse, handleApiError } from "./axios-instance"

export interface DashboardStats {
  totalSchools: number
  totalDepartments: number
  totalPrograms: number
  totalCourses: number
  totalStudents: number
  totalLecturers: number
  activeStudents: number
  activeLecturers: number
}

export interface EnrollmentStats {
  semesterId: string
  semesterName: string
  totalEnrollments: number
}

export interface AtRiskStudentStats {
  programId: string
  programName: string
  atRiskCount: number
  totalStudents: number
  percentage: number
}

export interface RecentActivity {
  id: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  timestamp: string
}

// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await axiosInstance.get<DashboardStats>("/dashboard/stats")
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// Get enrollment statistics
export const getEnrollmentStats = async (): Promise<EnrollmentStats[]> => {
  try {
    const response = await axiosInstance.get<EnrollmentStats[]>("/dashboard/enrollments")
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// Get at-risk student statistics
export const getAtRiskStudentStats = async (): Promise<AtRiskStudentStats[]> => {
  try {
    const response = await axiosInstance.get<AtRiskStudentStats[]>("/dashboard/at-risk-students")
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

// Get recent activities
export const getRecentActivities = async (limit = 10): Promise<RecentActivity[]> => {
  try {
    const response = await axiosInstance.get<RecentActivity[]>(`/dashboard/recent-activities?limit=${limit}`)
    return handleApiResponse(response)
  } catch (error) {
    return handleApiError(error)
  }
}

export const dashboardApi = {
  getDashboardStats: () => {
    return axiosInstance.get("/dashboard/stats")
  },
  getRecentActivities: () => {
    return axiosInstance.get("/dashboard/recent-activities")
  },
  getCourseEnrollmentStats: () => {
    return axiosInstance.get("/dashboard/course-enrollments")
  },
  getAtRiskStudentsStats: () => {
    return axiosInstance.get("/dashboard/at-risk-students")
  },
}
