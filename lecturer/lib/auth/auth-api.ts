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
  CourseTopic,
  CreateTopicPayload,
  UpdateTopicPayload,
  TopicProgressStatistics,
  StudentTopicProgress,
  CourseMasteryStatistics,
  StudentMastery,
  AttendanceRecord,
  AttendanceFilters,
  CreateAttendanceRequest,
  BulkCreateAttendanceRequest,
  UpdateAttendanceRequest,
  AttendanceStatistics,
  CourseAttendanceSummary,
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

// Course Topics API
export const getCourseTopics = async (courseId: string, semesterId: string): Promise<CourseTopic[]> => {
  const response = await axiosInstance.get<CourseTopic[]>(
    `/lecturer-portal/course-topics/course/${courseId}/semester/${semesterId}`,
  )
  return response.data
}

export const getCourseTopic = async (topicId: string): Promise<CourseTopic> => {
  const response = await axiosInstance.get<CourseTopic>(`/lecturer-portal/course-topic/${topicId}`)
  return response.data
}

export const createCourseTopic = async (data: CreateTopicPayload): Promise<CourseTopic> => {
  const response = await axiosInstance.post<CourseTopic>("/lecturer-portal/course-topic/", data)
  return response.data
}

export const updateCourseTopic = async (topicId: string, data: UpdateTopicPayload): Promise<CourseTopic> => {
  const response = await axiosInstance.patch<CourseTopic>(`/lecturer-portal/course-topic/${topicId}`, data)
  return response.data
}

export const deleteCourseTopic = async (topicId: string): Promise<void> => {
  await axiosInstance.delete(`/lecturer-portal/course-topic/${topicId}`)
}

// Course Progress APIs
export const getTopicProgressStatistics = async (
  courseId: string,
  semesterId: string,
): Promise<TopicProgressStatistics[]> => {
  const response = await axiosInstance.get<TopicProgressStatistics[]>(
    `/lecturer-portal/topic-progress-statistics/course/${courseId}/semester/${semesterId}`,
  )
  return response.data
}

export const getStudentTopicProgress = async (
  studentProfileId: string,
  courseId: string,
  semesterId: string,
): Promise<StudentTopicProgress> => {
  const response = await axiosInstance.get<StudentTopicProgress>(
    `/lecturer-portal/student-topic-progress/studentProfile/${studentProfileId}/course/${courseId}/semester/${semesterId}`,
  )
  return response.data
}

export const getCourseMasteryStatistics = async (
  courseId: string,
  semesterId: string,
): Promise<CourseMasteryStatistics> => {
  const response = await axiosInstance.get<CourseMasteryStatistics>(
    `/lecturer-portal/course-mastery-statistics/course/${courseId}/semester/${semesterId}`,
  )
  return response.data
}

export const getCourseStudentMasteries = async (courseId: string, semesterId: string): Promise<StudentMastery[]> => {
  const response = await axiosInstance.get<StudentMastery[]>(
    `/lecturer-portal/course-student-masteries/course/${courseId}/semester/${semesterId}`,
  )
  return response.data
}

// Attendance APIs
export const getAttendanceRecords = async (filters?: AttendanceFilters): Promise<AttendanceRecord[]> => {
  const queryParams = new URLSearchParams()

  if (filters) {
    if (filters.courseId) queryParams.append("courseId", filters.courseId)
    if (filters.semesterId) queryParams.append("semesterId", filters.semesterId)
    if (filters.studentProfileId) queryParams.append("studentProfileId", filters.studentProfileId)
    if (filters.isPresent !== undefined) queryParams.append("isPresent", filters.isPresent.toString())
    if (filters.lecturerProfileId) queryParams.append("lecturerProfileId", filters.lecturerProfileId)
    if (filters.startDate) queryParams.append("startDate", filters.startDate)
    if (filters.endDate) queryParams.append("endDate", filters.endDate)
  }

  const url = `/attendance${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  const response = await axiosInstance.get<AttendanceRecord[]>(url)
  return response.data
}

export const getAttendanceById = async (id: string): Promise<AttendanceRecord> => {
  const response = await axiosInstance.get<AttendanceRecord>(`/attendance/${id}`)
  return response.data
}

export const createAttendance = async (data: CreateAttendanceRequest): Promise<AttendanceRecord[]> => {
  const response = await axiosInstance.post<AttendanceRecord[]>("/attendance", data)
  return response.data
}

export const createBulkAttendance = async (data: BulkCreateAttendanceRequest): Promise<AttendanceRecord[]> => {
  const response = await axiosInstance.post<AttendanceRecord[]>("/attendance/bulk", data)
  return response.data
}

export const updateAttendance = async (id: string, data: UpdateAttendanceRequest): Promise<AttendanceRecord> => {
  const response = await axiosInstance.patch<AttendanceRecord>(`/attendance/${id}`, data)
  return response.data
}

export const deleteAttendance = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/attendance/${id}`)
}

export const getStudentAttendanceStatistics = async (
  studentProfileId: string,
  courseId: string,
  semesterId: string,
): Promise<AttendanceStatistics> => {
  const response = await axiosInstance.get<AttendanceStatistics>(
    `/attendance/statistics/student/${studentProfileId}/course/${courseId}/semester/${semesterId}`,
  )
  return response.data
}

export const getCourseAttendanceSummary = async (
  courseId: string,
  semesterId: string,
): Promise<CourseAttendanceSummary> => {
  const response = await axiosInstance.get<CourseAttendanceSummary>(
    `/attendance/summary/course/${courseId}/semester/${semesterId}`,
  )
  return response.data
}
