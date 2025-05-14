"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-context"
import * as authApi from "./auth-api"
import type {
  LoginCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
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
  QuizFilterDto,
  Quiz,
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizStatistics,
  QuizAttempt,
} from "./types"

// Authentication hooks
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser, setLecturerProfile, setTokens, setIsAuthenticated } = useAuth()
  const router = useRouter()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login(credentials)
      setUser(response.user)
      setLecturerProfile(response.lecturerProfile)
      setTokens(response.accessToken, response.refreshToken)
      setIsAuthenticated(true)

      // Add a small delay before redirecting to ensure state is updated
      setTimeout(() => {
        router.push("/")
      }, 100)

      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { clearAuth, refreshToken } = useAuth()
  const router = useRouter()

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
      clearAuth()
      router.push("/login")
    } catch (err: any) {
      // Even if the API call fails, we still want to clear the local auth state
      const errorMessage = err.response?.data?.message || "Logout failed. Local state has been cleared."
      setError(errorMessage)
      clearAuth()
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }

  return { logout, isLoading, error }
}

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const forgotPassword = async (data: ForgotPasswordRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.forgotPassword(data)
      setSuccess(response.message)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to send reset link. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { forgotPassword, isLoading, error, success }
}

export const useResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.resetPassword(data)
      setSuccess(response.message)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to reset password. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { resetPassword, isLoading, error, success }
}

export const useChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const changePassword = async (data: ChangePasswordRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.changePassword(data)
      setSuccess(response.message)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to change password. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { changePassword, isLoading, error, success }
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useAuth()

  const getProfile = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const user = await authApi.getProfile()
      setUser(user)
      return user
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch profile. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const updatedUser = await authApi.updateProfile(data)
      setUser(updatedUser)
      return updatedUser
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update profile. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getProfile, updateProfile, isLoading, error }
}

// Dashboard hooks
export const useDashboard = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  const getDashboard = async (lecturerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getLecturerDashboard(lecturerId)
      setDashboardData(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch dashboard data. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getDashboard, dashboardData, isLoading, error }
}

// Course hooks
export const useCourses = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<CourseData[]>([])

  const getCourses = async (lecturerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getLecturerCourses(lecturerId)
      setCourses(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch courses. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getCourses, courses, isLoading, error }
}

// Student hooks
export const useStudent = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [student, setStudent] = useState<StudentDetail | null>(null)

  const getStudentById = async (studentId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getStudentById(studentId)
      setStudent(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch student data. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getStudentById, student, isLoading, error }
}

export const useAtRiskStudents = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([])

  const getAtRiskStudents = async (lecturerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getAtRiskStudents(lecturerId)
      setAtRiskStudents(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch at-risk students. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getAtRiskStudents, atRiskStudents, isLoading, error }
}

// Course analytics hooks
export const useCourseMastery = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [masteryData, setMasteryData] = useState<CourseMasteryData | null>(null)

  const getCourseMasteryDistribution = async (lecturerId: string, courseId: string, semesterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getCourseMasteryDistribution(lecturerId, courseId, semesterId)
      setMasteryData(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch course mastery data. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getCourseMasteryDistribution, masteryData, isLoading, error }
}

export const useStudentEngagement = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [engagementData, setEngagementData] = useState<StudentEngagementData | null>(null)

  const getStudentEngagement = async (lecturerId: string, courseId: string, semesterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getStudentEngagement(lecturerId, courseId, semesterId)
      setEngagementData(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch student engagement data. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getStudentEngagement, engagementData, isLoading, error }
}

// Virtual Classes hooks
export const useVirtualClasses = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [virtualClasses, setVirtualClasses] = useState<VirtualClass[]>([])

  const getUpcomingVirtualClasses = async (lecturerId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getUpcomingVirtualClasses(lecturerId)
      setVirtualClasses(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch upcoming virtual classes. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getVirtualClassesByCourseAndSemester = async (courseId: string, semesterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getVirtualClassesByCourseAndSemester(courseId, semesterId)
      setVirtualClasses(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch virtual classes for this course. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getUpcomingVirtualClasses,
    getVirtualClassesByCourseAndSemester,
    virtualClasses,
    isLoading,
    error,
  }
}

export const useVirtualClassActions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const createVirtualClass = async (data: CreateVirtualClassRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.createVirtualClass(data)
      setSuccess("Virtual class created successfully")
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create virtual class. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateVirtualClass = async (id: string, data: UpdateVirtualClassRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.updateVirtualClass(id, data)
      setSuccess("Virtual class updated successfully")
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update virtual class. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteVirtualClass = async (id: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await authApi.deleteVirtualClass(id)
      setSuccess("Virtual class deleted successfully")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete virtual class. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createVirtualClass,
    updateVirtualClass,
    deleteVirtualClass,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
  }
}

export const useVirtualClassAttendance = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attendance, setAttendance] = useState<VirtualClassAttendance[]>([])
  const [statistics, setStatistics] = useState<VirtualClassAttendanceStatistics | null>(null)

  const getVirtualClassAttendance = async (virtualClassId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getVirtualClassAttendance(virtualClassId)
      setAttendance(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch virtual class attendance. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getVirtualClassAttendanceStatistics = async (virtualClassId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getVirtualClassAttendanceStatistics(virtualClassId)
      setStatistics(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch attendance statistics. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getVirtualClassAttendance,
    getVirtualClassAttendanceStatistics,
    attendance,
    statistics,
    isLoading,
    error,
  }
}

// Quiz hooks
export const useQuizzes = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])

  const getQuizzesByFilters = async (filters?: QuizFilterDto) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getQuizzes(filters)
      setQuizzes(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch quizzes. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getQuizzesByFilters, quizzes, isLoading, error }
}

export const useQuiz = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)

  const getQuizById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getQuizById(id)
      setQuiz(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch quiz. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getQuizById, quiz, isLoading, error }
}

export const useQuizActions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const createQuiz = async (data: CreateQuizRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.createQuiz(data)
      setSuccess("Quiz created successfully")
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create quiz. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuiz = async (id: string, data: UpdateQuizRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.updateQuiz(id, data)
      setSuccess("Quiz updated successfully")
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update quiz. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteQuiz = async (id: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await authApi.deleteQuiz(id)
      setSuccess("Quiz deleted successfully")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete quiz. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createQuiz,
    updateQuiz,
    deleteQuiz,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
  }
}

export const useQuizStatistics = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState<QuizStatistics | null>(null)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])

  const getQuizStatistics = async (quizId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getQuizStatistics(quizId)
      setStatistics(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch quiz statistics. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getQuizAttempts = async (quizId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getQuizAttempts(quizId)
      setAttempts(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch quiz attempts. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getQuizStatistics,
    getQuizAttempts,
    statistics,
    attempts,
    isLoading,
    error,
  }
}
