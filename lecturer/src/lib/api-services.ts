import axios from "axios"

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Lecturer API services
export const lecturerService = {
  // Profile
  getLecturerProfile: async (userId: string) => {
    const response = await api.get(`/lecturers/${userId}`)
    return response.data
  },

  // Courses
  getLecturerCourses: async (lecturerId: string) => {
    const response = await api.get(`/lecturers/${lecturerId}/courses`)
    return response.data
  },

  getCourseDetails: async (courseId: string, lecturerId: string) => {
    const response = await api.get(`/lecturers/${lecturerId}/courses/${courseId}`)
    return response.data
  },

  getCourseStudents: async (courseId: string, lecturerId: string) => {
    const response = await api.get(`/lecturers/${lecturerId}/courses/${courseId}/students`)
    return response.data
  },

  getCourseAssessments: async (courseId: string, lecturerId: string) => {
    const response = await api.get(`/lecturers/${lecturerId}/courses/${courseId}/assessments`)
    return response.data
  },

  getCourseMaterials: async (courseId: string, lecturerId: string) => {
    const response = await api.get(`/lecturers/${lecturerId}/courses/${courseId}/materials`)
    return response.data
  },

  // Assessments
  getLecturerAssessments: async (lecturerId: string) => {
    const response = await api.get(`/lecturers/${lecturerId}/assessments`)
    return response.data
  },

  createAssessment: async (assessmentData: any) => {
    const response = await api.post("/lecturers/assessment", assessmentData)
    return response.data
  },

  updateAssessment: async (id: string, assessmentData: any) => {
    const response = await api.put(`/lecturers/assessment/${id}`, assessmentData)
    return response.data
  },

  deleteAssessment: async (id: string) => {
    const response = await api.delete(`/lecturers/assessment/${id}`)
    return response.data
  },

  getAssessmentSubmissions: async (assessmentId: string) => {
    const response = await api.get(`/lecturers/assessment/${assessmentId}/submissions`)
    return response.data
  },

  gradeSubmission: async (id: string, gradeData: { grade: number; feedback: string }) => {
    const response = await api.put(`/lecturers/submission/${id}/grade`, gradeData)
    return response.data
  },

  // Teaching Materials
  getTeachingMaterials: async (lecturerId: string) => {
    const response = await api.get(`/lecturers/${lecturerId}/teaching-materials`)
    return response.data
  },

  getTeachingMaterialById: async (id: string) => {
    const response = await api.get(`/lecturers/teaching-material/${id}`)
    return response.data
  },

  createTeachingMaterial: async (materialData: any) => {
    const response = await api.post("/lecturers/teaching-material", materialData)
    return response.data
  },

  updateTeachingMaterial: async (id: string, materialData: any) => {
    const response = await api.put(`/lecturers/teaching-material/${id}`, materialData)
    return response.data
  },

  deleteTeachingMaterial: async (id: string) => {
    const response = await api.delete(`/lecturers/teaching-material/${id}`)
    return response.data
  },

  // Video uploads
  uploadVideo: async (formData: FormData) => {
    const response = await api.post("/lecturers/upload-video", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  addYoutubeVideo: async (videoData: any) => {
    const response = await api.post("/lecturers/add-youtube-video", videoData)
    return response.data
  },

  // Virtual Classes
  getVirtualClasses: async (lecturerId: string) => {
    const response = await api.get(`/virtual-classes/lecturer/${lecturerId}`)
    return response.data
  },

  createVirtualClass: async (classData: any) => {
    const response = await api.post("/virtual-classes", classData)
    return response.data
  },

  updateVirtualClass: async (id: string, classData: any) => {
    const response = await api.put(`/virtual-classes/${id}`, classData)
    return response.data
  },

  deleteVirtualClass: async (id: string) => {
    const response = await api.delete(`/virtual-classes/${id}`)
    return response.data
  },

  // Quizzes
  getQuizzes: async (lecturerId: string) => {
    const response = await api.get(`/quizzes/lecturer/${lecturerId}`)
    return response.data
  },

  createQuiz: async (quizData: any) => {
    const response = await api.post("/quizzes", quizData)
    return response.data
  },

  updateQuiz: async (id: string, quizData: any) => {
    const response = await api.put(`/quizzes/${id}`, quizData)
    return response.data
  },

  deleteQuiz: async (id: string) => {
    const response = await api.delete(`/quizzes/${id}`)
    return response.data
  },

  // Dashboard statistics
  getLecturerDashboardStats: async (lecturerId: string) => {
    const response = await api.get(`/lecturer-dashboard/stats/${lecturerId}`)
    return response.data
  },

  getUpcomingClasses: async (lecturerId: string) => {
    const response = await api.get(`/lecturer-dashboard/upcoming-classes/${lecturerId}`)
    return response.data
  },

  getAssessmentOverview: async (lecturerId: string) => {
    const response = await api.get(`/lecturer-dashboard/assessment-overview/${lecturerId}`)
    return response.data
  },

  getStudentEngagement: async (lecturerId: string) => {
    const response = await api.get(`/lecturer-dashboard/student-engagement/${lecturerId}`)
    return response.data
  },

  getAtRiskStudents: async (lecturerId: string) => {
    const response = await api.get(`/lecturer-dashboard/at-risk-students/${lecturerId}`)
    return response.data
  },

  // Student performance
  getStudentPerformance: async (courseId: string, semesterId: string) => {
    const response = await api.get(`/student-performance/course/${courseId}/semester/${semesterId}`)
    return response.data
  },
}

// Auth service
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/auth/login", credentials)
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("user")
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }
    const response = await api.post("/auth/refresh-token", { refreshToken })
    if (response.data.token) {
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("refreshToken", response.data.refreshToken)
    }
    return response.data
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },
}

export default api
