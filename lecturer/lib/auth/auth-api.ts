import axiosInstance from "../axios"
import type {
  LoginCredentials,
  LoginResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateProfileRequest,
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
  QuizFilterDto,
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizStatistics,
  QuizAttempt,
  DashboardData,
  CourseData,
  StudentDetail,
  AtRiskStudent,
  CourseMasteryData,
  StudentEngagementData,
  VirtualClass,
  CreateVirtualClassRequest,
  UpdateVirtualClassRequest,
  VirtualClassAttendance,
  VirtualClassAttendanceStatistics,
} from "./types"

// Authentication API functions
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/auth/login", credentials)
  return response.data
}

export const refreshToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const response = await axiosInstance.post<RefreshTokenResponse>("/auth/refresh-token", data)
  return response.data
}

export const logout = async (refreshToken: string): Promise<void> => {
  await axiosInstance.post("/auth/logout", { refreshToken })
}

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  const response = await axiosInstance.post<ForgotPasswordResponse>("/auth/forgot-password", data)
  return response.data
}

export const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await axiosInstance.post<ResetPasswordResponse>("/auth/reset-password", data)
  return response.data
}

export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const response = await axiosInstance.post<ChangePasswordResponse>("/auth/change-password", data)
  return response.data
}

export const getProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<User>("/auth/profile")
  return response.data
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await axiosInstance.put<User>("/auth/profile", data)
  return response.data
}

// Dashboard API
export const getLecturerDashboard = async (lecturerId: string): Promise<DashboardData> => {
  const response = await axiosInstance.get<{ success: boolean; data: DashboardData }>(
    `/lecturer-dashboard/${lecturerId}`,
  )
  return response.data.data
}

// Courses API
export const getLecturerCourses = async (lecturerId: string): Promise<CourseData[]> => {
  const response = await axiosInstance.get<{ success: boolean; data: CourseData[] }>(
    `/lecturer-dashboard/${lecturerId}/courses`,
  )
  return response.data.data
}

// Student API
export const getStudentById = async (studentId: string): Promise<StudentDetail> => {
  const response = await axiosInstance.get<StudentDetail>(`/students/student-id/${studentId}`)
  return response.data
}

export const getAtRiskStudents = async (lecturerId: string): Promise<AtRiskStudent[]> => {
  const response = await axiosInstance.get<{ success: boolean; data: AtRiskStudent[] }>(
    `/lecturer-dashboard/${lecturerId}/at-risk-students`,
  )
  return response.data.data
}

// Course Analytics API
export const getCourseMasteryDistribution = async (
  lecturerId: string,
  courseId: string,
  semesterId: string,
): Promise<CourseMasteryData> => {
  const response = await axiosInstance.get<{ success: boolean; data: CourseMasteryData }>(
    `/lecturer-dashboard/${lecturerId}/course-mastery-distribution/${courseId}/${semesterId}`,
  )
  return response.data.data
}

export const getStudentEngagement = async (
  lecturerId: string,
  courseId: string,
  semesterId: string,
): Promise<StudentEngagementData> => {
  const response = await axiosInstance.get<{ success: boolean; data: StudentEngagementData }>(
    `/lecturer-portal/${lecturerId}/student-engagement/${courseId}/${semesterId}`,
  )
  return response.data.data
}

// Virtual Classes API
export const getUpcomingVirtualClasses = async (lecturerId: string): Promise<VirtualClass[]> => {
  const response = await axiosInstance.get<VirtualClass[]>(`/virtual-classes/upcoming/${lecturerId}`)
  return response.data
}

export const getVirtualClassesByCourseAndSemester = async (
  courseId: string,
  semesterId: string,
): Promise<VirtualClass[]> => {
  const response = await axiosInstance.get<VirtualClass[]>(`/virtual-classes/course/${courseId}/semester/${semesterId}`)
  return response.data
}

export const createVirtualClass = async (data: CreateVirtualClassRequest): Promise<VirtualClass> => {
  const response = await axiosInstance.post<VirtualClass>("/virtual-classes", data)
  return response.data
}

export const updateVirtualClass = async (id: string, data: UpdateVirtualClassRequest): Promise<VirtualClass> => {
  const response = await axiosInstance.patch<VirtualClass>(`/virtual-classes/${id}`, data)
  return response.data
}

export const deleteVirtualClass = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/virtual-classes/${id}`)
}

export const getVirtualClassAttendance = async (virtualClassId: string): Promise<VirtualClassAttendance[]> => {
  const response = await axiosInstance.get<VirtualClassAttendance[]>(`/virtual-classes/${virtualClassId}/attendance`)
  return response.data
}

export const getVirtualClassAttendanceStatistics = async (
  virtualClassId: string,
): Promise<VirtualClassAttendanceStatistics> => {
  const response = await axiosInstance.get<VirtualClassAttendanceStatistics>(
    `/virtual-classes/${virtualClassId}/attendance/statistics`,
  )
  return response.data
}

// Quiz API
export const getQuizzes = async (filters?: QuizFilterDto): Promise<Quiz[]> => {
  const queryParams = new URLSearchParams()

  if (filters) {
    if (filters.courseId) queryParams.append("courseId", filters.courseId)
    if (filters.semesterId) queryParams.append("semesterId", filters.semesterId)
    if (filters.lecturerProfileId) queryParams.append("lecturerProfileId", filters.lecturerProfileId)
    if (filters.isActive !== undefined) queryParams.append("isActive", filters.isActive.toString())
    if (filters.search) queryParams.append("search", filters.search)
  }

  const url = `/quizzes${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  const response = await axiosInstance.get<Quiz[]>(url)
  return response.data
}

export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await axiosInstance.get<Quiz>(`/quizzes/${id}`)
  return response.data
}

export const createQuiz = async (data: CreateQuizRequest): Promise<Quiz> => {
  const response = await axiosInstance.post<Quiz>("/quizzes", data)
  return response.data
}

export const updateQuiz = async (id: string, data: UpdateQuizRequest): Promise<Quiz> => {
  const response = await axiosInstance.patch<Quiz>(`/quizzes/${id}`, data)
  return response.data
}

export const deleteQuiz = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/quizzes/${id}`)
}

export const getQuizStatistics = async (quizId: string): Promise<QuizStatistics> => {
  const response = await axiosInstance.get<QuizStatistics>(`/quizzes/${quizId}/statistics`)
  return response.data
}

export const getQuizAttempts = async (quizId: string): Promise<QuizAttempt[]> => {
  const response = await axiosInstance.get<QuizAttempt[]>(`/quizzes/${quizId}/attempts`)
  return response.data
}
