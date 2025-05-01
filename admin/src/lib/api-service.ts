import axios from "axios"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, { refreshToken })

        const { accessToken, refreshToken: newRefreshToken } = response.data

        localStorage.setItem("token", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")

        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password })
    return response.data
  },
  register: async (userData: any) => {
    const response = await apiClient.post("/auth/register", userData)
    return response.data
  },
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post("/auth/refresh-token", { refreshToken })
    return response.data
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post("/auth/forgot-password", { email })
    return response.data
  },
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post("/auth/reset-password", { token, password })
    return response.data
  },
  getProfile: async () => {
    const response = await apiClient.get("/auth/profile")
    return response.data
  },
  updateProfile: async (profileData: any) => {
    const response = await apiClient.put("/auth/profile", profileData)
    return response.data
  },
}

// School API
export const schoolApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/schools", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/schools/${id}`)
    return response.data
  },
  create: async (schoolData: any) => {
    const response = await apiClient.post("/schools", schoolData)
    return response.data
  },
  update: async (id: string, schoolData: any) => {
    const response = await apiClient.put(`/schools/${id}`, schoolData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/schools/${id}`)
    return response.data
  },
}

// Department API
export const departmentApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/departments", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/departments/${id}`)
    return response.data
  },
  create: async (departmentData: any) => {
    const response = await apiClient.post("/departments", departmentData)
    return response.data
  },
  update: async (id: string, departmentData: any) => {
    const response = await apiClient.put(`/departments/${id}`, departmentData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/departments/${id}`)
    return response.data
  },
  getBySchool: async (schoolId: string) => {
    const response = await apiClient.get(`/schools/${schoolId}/departments`)
    return response.data
  },
}

// Program API
export const programApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/programs", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/programs/${id}`)
    return response.data
  },
  create: async (programData: any) => {
    const response = await apiClient.post("/programs", programData)
    return response.data
  },
  update: async (id: string, programData: any) => {
    const response = await apiClient.put(`/programs/${id}`, programData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/programs/${id}`)
    return response.data
  },
  getByDepartment: async (departmentId: string) => {
    const response = await apiClient.get(`/departments/${departmentId}/programs`)
    return response.data
  },
}

// Course API
export const courseApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/courses", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/courses/${id}`)
    return response.data
  },
  create: async (courseData: any) => {
    const response = await apiClient.post("/courses", courseData)
    return response.data
  },
  update: async (id: string, courseData: any) => {
    const response = await apiClient.put(`/courses/${id}`, courseData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/courses/${id}`)
    return response.data
  },
  getByProgram: async (programId: string) => {
    const response = await apiClient.get(`/programs/${programId}/courses`)
    return response.data
  },
}

// Semester API
export const semesterApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/semesters", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/semesters/${id}`)
    return response.data
  },
  create: async (semesterData: any) => {
    const response = await apiClient.post("/semesters", semesterData)
    return response.data
  },
  update: async (id: string, semesterData: any) => {
    const response = await apiClient.put(`/semesters/${id}`, semesterData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/semesters/${id}`)
    return response.data
  },
  getCurrent: async () => {
    const response = await apiClient.get("/semesters/current")
    return response.data
  },
}

// User API
export const userApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/users", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },
  create: async (userData: any) => {
    const response = await apiClient.post("/users", userData)
    return response.data
  },
  update: async (id: string, userData: any) => {
    const response = await apiClient.put(`/users/${id}`, userData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`)
    return response.data
  },
  getStudents: async (params?: any) => {
    const response = await apiClient.get("/users/students", { params })
    return response.data
  },
  getLecturers: async (params?: any) => {
    const response = await apiClient.get("/users/lecturers", { params })
    return response.data
  },
  getAdmins: async (params?: any) => {
    const response = await apiClient.get("/users/admins", { params })
    return response.data
  },
}

// Student Profile API
export const studentProfileApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/student-profiles", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/student-profiles/${id}`)
    return response.data
  },
  getByUserId: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/student-profile`)
    return response.data
  },
  update: async (id: string, profileData: any) => {
    const response = await apiClient.put(`/student-profiles/${id}`, profileData)
    return response.data
  },
}

// Lecturer Profile API
export const lecturerProfileApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/lecturer-profiles", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/lecturer-profiles/${id}`)
    return response.data
  },
  getByUserId: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/lecturer-profile`)
    return response.data
  },
  update: async (id: string, profileData: any) => {
    const response = await apiClient.put(`/lecturer-profiles/${id}`, profileData)
    return response.data
  },
}

// Course Enrollment API
export const courseEnrollmentApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/course-enrollments", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/course-enrollments/${id}`)
    return response.data
  },
  create: async (enrollmentData: any) => {
    const response = await apiClient.post("/course-enrollments", enrollmentData)
    return response.data
  },
  update: async (id: string, enrollmentData: any) => {
    const response = await apiClient.put(`/course-enrollments/${id}`, enrollmentData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/course-enrollments/${id}`)
    return response.data
  },
  getByStudent: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}/enrollments`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/enrollments`)
    return response.data
  },
}

// Course Assignment API
export const courseAssignmentApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/course-assignments", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/course-assignments/${id}`)
    return response.data
  },
  create: async (assignmentData: any) => {
    const response = await apiClient.post("/course-assignments", assignmentData)
    return response.data
  },
  update: async (id: string, assignmentData: any) => {
    const response = await apiClient.put(`/course-assignments/${id}`, assignmentData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/course-assignments/${id}`)
    return response.data
  },
  getByLecturer: async (lecturerId: string) => {
    const response = await apiClient.get(`/lecturers/${lecturerId}/assignments`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/assignments`)
    return response.data
  },
}

// Quiz API
export const quizApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/quizzes", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/quizzes/${id}`)
    return response.data
  },
  create: async (quizData: any) => {
    const response = await apiClient.post("/quizzes", quizData)
    return response.data
  },
  update: async (id: string, quizData: any) => {
    const response = await apiClient.put(`/quizzes/${id}`, quizData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/quizzes/${id}`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/quizzes`)
    return response.data
  },
  getQuestions: async (quizId: string) => {
    const response = await apiClient.get(`/quizzes/${quizId}/questions`)
    return response.data
  },
  addQuestion: async (quizId: string, questionData: any) => {
    const response = await apiClient.post(`/quizzes/${quizId}/questions`, questionData)
    return response.data
  },
  updateQuestion: async (quizId: string, questionId: string, questionData: any) => {
    const response = await apiClient.put(`/quizzes/${quizId}/questions/${questionId}`, questionData)
    return response.data
  },
  deleteQuestion: async (quizId: string, questionId: string) => {
    const response = await apiClient.delete(`/quizzes/${quizId}/questions/${questionId}`)
    return response.data
  },
  getAttempts: async (quizId: string) => {
    const response = await apiClient.get(`/quizzes/${quizId}/attempts`)
    return response.data
  },
}

// Quiz Question API
export const quizQuestionApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/quiz-questions", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/quiz-questions/${id}`)
    return response.data
  },
  create: async (questionData: any) => {
    const response = await apiClient.post("/quiz-questions", questionData)
    return response.data
  },
  update: async (id: string, questionData: any) => {
    const response = await apiClient.put(`/quiz-questions/${id}`, questionData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/quiz-questions/${id}`)
    return response.data
  },
  getOptions: async (questionId: string) => {
    const response = await apiClient.get(`/quiz-questions/${questionId}/options`)
    return response.data
  },
  addOption: async (questionId: string, optionData: any) => {
    const response = await apiClient.post(`/quiz-questions/${questionId}/options`, optionData)
    return response.data
  },
  updateOption: async (questionId: string, optionId: string, optionData: any) => {
    const response = await apiClient.put(`/quiz-questions/${questionId}/options/${optionId}`, optionData)
    return response.data
  },
  deleteOption: async (questionId: string, optionId: string) => {
    const response = await apiClient.delete(`/quiz-questions/${questionId}/options/${optionId}`)
    return response.data
  },
}

// Virtual Class API
export const virtualClassApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/virtual-classes", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/virtual-classes/${id}`)
    return response.data
  },
  create: async (classData: any) => {
    const response = await apiClient.post("/virtual-classes", classData)
    return response.data
  },
  update: async (id: string, classData: any) => {
    const response = await apiClient.put(`/virtual-classes/${id}`, classData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/virtual-classes/${id}`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/virtual-classes`)
    return response.data
  },
  getAttendance: async (classId: string) => {
    const response = await apiClient.get(`/virtual-classes/${classId}/attendance`)
    return response.data
  },
  recordAttendance: async (classId: string, attendanceData: any) => {
    const response = await apiClient.post(`/virtual-classes/${classId}/attendance`, attendanceData)
    return response.data
  },
}

// Teaching Material API
export const teachingMaterialApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/teaching-materials", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/teaching-materials/${id}`)
    return response.data
  },
  create: async (materialData: any) => {
    const response = await apiClient.post("/teaching-materials", materialData)
    return response.data
  },
  update: async (id: string, materialData: any) => {
    const response = await apiClient.put(`/teaching-materials/${id}`, materialData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/teaching-materials/${id}`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/teaching-materials`)
    return response.data
  },
}

// Course Topic API
export const courseTopicApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/course-topics", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/course-topics/${id}`)
    return response.data
  },
  create: async (topicData: any) => {
    const response = await apiClient.post("/course-topics", topicData)
    return response.data
  },
  update: async (id: string, topicData: any) => {
    const response = await apiClient.put(`/course-topics/${id}`, topicData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/course-topics/${id}`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/topics`)
    return response.data
  },
}

// Topic Progress API
export const topicProgressApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/topic-progress", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/topic-progress/${id}`)
    return response.data
  },
  create: async (progressData: any) => {
    const response = await apiClient.post("/topic-progress", progressData)
    return response.data
  },
  update: async (id: string, progressData: any) => {
    const response = await apiClient.put(`/topic-progress/${id}`, progressData)
    return response.data
  },
  getByStudent: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}/topic-progress`)
    return response.data
  },
  getByTopic: async (topicId: string) => {
    const response = await apiClient.get(`/course-topics/${topicId}/progress`)
    return response.data
  },
}

// At Risk Student API
export const atRiskStudentApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/at-risk-students", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/at-risk-students/${id}`)
    return response.data
  },
  create: async (studentData: any) => {
    const response = await apiClient.post("/at-risk-students", studentData)
    return response.data
  },
  update: async (id: string, studentData: any) => {
    const response = await apiClient.put(`/at-risk-students/${id}`, studentData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/at-risk-students/${id}`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/at-risk-students`)
    return response.data
  },
}

// Learning Resource API
export const learningResourceApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/learning-resources", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/learning-resources/${id}`)
    return response.data
  },
  create: async (resourceData: any) => {
    const response = await apiClient.post("/learning-resources", resourceData)
    return response.data
  },
  update: async (id: string, resourceData: any) => {
    const response = await apiClient.put(`/learning-resources/${id}`, resourceData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/learning-resources/${id}`)
    return response.data
  },
  getByCourse: async (courseId: string) => {
    const response = await apiClient.get(`/courses/${courseId}/learning-resources`)
    return response.data
  },
}

// Learning Recommendation API
export const learningRecommendationApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/learning-recommendations", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/learning-recommendations/${id}`)
    return response.data
  },
  create: async (recommendationData: any) => {
    const response = await apiClient.post("/learning-recommendations", recommendationData)
    return response.data
  },
  update: async (id: string, recommendationData: any) => {
    const response = await apiClient.put(`/learning-recommendations/${id}`, recommendationData)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/learning-recommendations/${id}`)
    return response.data
  },
  getByStudent: async (studentId: string) => {
    const response = await apiClient.get(`/students/${studentId}/recommendations`)
    return response.data
  },
}

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get("/dashboard/stats")
    return response.data
  },
  getAtRiskStudentsData: async () => {
    const response = await apiClient.get("/dashboard/at-risk-students")
    return response.data
  },
  getCourseEnrollmentData: async () => {
    const response = await apiClient.get("/dashboard/course-enrollments")
    return response.data
  },
  getRecentActivity: async () => {
    const response = await apiClient.get("/dashboard/recent-activity")
    return response.data
  },
}

// Notification API
export const notificationApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get("/notifications", { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/notifications/${id}`)
    return response.data
  },
  create: async (notificationData: any) => {
    const response = await apiClient.post("/notifications", notificationData)
    return response.data
  },
  markAsRead: async (id: string) => {
    const response = await apiClient.put(`/notifications/${id}/read`)
    return response.data
  },
  markAllAsRead: async () => {
    const response = await apiClient.put("/notifications/read-all")
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/notifications/${id}`)
    return response.data
  },
  getUnread: async () => {
    const response = await apiClient.get("/notifications/unread")
    return response.data
  },
}

// Export all APIs
export const api = {
  auth: authApi,
  school: schoolApi,
  department: departmentApi,
  program: programApi,
  course: courseApi,
  semester: semesterApi,
  user: userApi,
  studentProfile: studentProfileApi,
  lecturerProfile: lecturerProfileApi,
  courseEnrollment: courseEnrollmentApi,
  courseAssignment: courseAssignmentApi,
  quiz: quizApi,
  quizQuestion: quizQuestionApi,
  virtualClass: virtualClassApi,
  teachingMaterial: teachingMaterialApi,
  courseTopic: courseTopicApi,
  topicProgress: topicProgressApi,
  atRiskStudent: atRiskStudentApi,
  learningResource: learningResourceApi,
  learningRecommendation: learningRecommendationApi,
  dashboard: dashboardApi,
  notification: notificationApi,
}

export default api
