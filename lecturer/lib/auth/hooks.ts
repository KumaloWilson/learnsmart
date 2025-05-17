"use client"

import { useState, useEffect, useCallback } from "react"
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
  CourseDetailResponse,
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
  PerformanceFilterDto,
  StudentPerformance,
  GenerateAnalysisRequest,
  GenerateClassAnalysisRequest,
  ClassPerformanceAnalysis,
} from "./types"

// Authentication hooks
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setUser, setLecturerProfile, setTokens, setIsAuthenticated } = useAuth()

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.login(credentials)
      setUser(response.user)
      setLecturerProfile(response.lecturerProfile)
      setTokens(response.accessToken, response.refreshToken)
      setIsAuthenticated(true)

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

  const logout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken)
      }
      clearAuth()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Logout failed. Local state has been cleared."
      setError(errorMessage)
      clearAuth()
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

  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.resetPassword(data)
      setSuccess(response.message)
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
  const [isInitialized, setIsInitialized] = useState(false)

  const getDashboard = useCallback(
    async (lecturerId: string) => {
      // Skip if already loading or if we've already successfully loaded data
      if (isLoading || (isInitialized && dashboardData && !error)) return dashboardData

      setIsLoading(true)
      setError(null)
      try {
        const data = await authApi.getLecturerDashboard(lecturerId)
        setDashboardData(data)
        setIsInitialized(true)
        return data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch dashboard data. Please try again."
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, isInitialized, dashboardData, error],
  )

  return { getDashboard, dashboardData, isLoading, error, isInitialized }
}

// Course hooks
export const useCourses = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<CourseData[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  const getCourses = useCallback(
    async (lecturerId: string) => {
      // Skip if already loading or if we've already successfully loaded data
      if (isLoading || (isInitialized && courses.length > 0 && !error)) return courses

      setIsLoading(true)
      setError(null)
      try {
        const data = await authApi.getLecturerCourses(lecturerId)
        setCourses(data)
        setIsInitialized(true)
        return data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch courses. Please try again."
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, isInitialized, courses, error],
  )

  return { getCourses, courses, isLoading, error, isInitialized }
}

export const useCourseDetail = (lecturerId: string, courseId: string, semesterId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courseDetail, setCourseDetail] = useState<CourseDetailResponse["data"] | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const getCourseDetail = useCallback(async () => {
    // Skip if already loading or if we've already successfully loaded data
    if (isLoading || (isInitialized && courseDetail && !error)) return courseDetail
    if (!lecturerId || !courseId || !semesterId) return null

    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getLecturerCourseDetail(lecturerId, courseId, semesterId)
      setCourseDetail(data)
      setIsInitialized(true)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch course details. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, isInitialized, courseDetail, error, lecturerId, courseId, semesterId])

  // Fetch course detail on mount or when dependencies change
  useEffect(() => {
    if (lecturerId && courseId && semesterId && !isInitialized && !isLoading) {
      getCourseDetail()
    }
  }, [lecturerId, courseId, semesterId, isInitialized, isLoading, getCourseDetail])

  return { courseDetail, isLoading, error, refetch: getCourseDetail }
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
  const [isInitialized, setIsInitialized] = useState(false)

  const getAtRiskStudents = useCallback(
    async (lecturerId: string) => {
      // Skip if already loading or if we've already successfully loaded data
      if (isLoading || (isInitialized && atRiskStudents.length > 0 && !error)) return atRiskStudents

      setIsLoading(true)
      setError(null)
      try {
        const data = await authApi.getAtRiskStudents(lecturerId)
        setAtRiskStudents(data)
        setIsInitialized(true)
        return data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch at-risk students. Please try again."
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, isInitialized, atRiskStudents, error],
  )

  return { getAtRiskStudents, atRiskStudents, isLoading, error, isInitialized }
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
  const [isInitialized, setIsInitialized] = useState(false)
  const [lastFilters, setLastFilters] = useState<QuizFilterDto | undefined>(undefined)

  const getQuizzesByFilters = useCallback(
    async (filters?: QuizFilterDto) => {
      // Skip if already loading or if we've already loaded with the same filters
      const filtersMatch = JSON.stringify(filters) === JSON.stringify(lastFilters)
      if (isLoading || (isInitialized && filtersMatch && !error)) return quizzes

      setIsLoading(true)
      setError(null)
      try {
        const data = await authApi.getQuizzes(filters)
        setQuizzes(data)
        setLastFilters(filters)
        setIsInitialized(true)
        return data
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || "Failed to fetch quizzes. Please try again."
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, isInitialized, quizzes, lastFilters, error],
  )

  return { getQuizzesByFilters, quizzes, isLoading, error, isInitialized }
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
      console.error("Error fetching quiz attempts:", err)
      const errorMessage = err.response?.data?.message || "Failed to fetch quiz attempts. Please try again."
      setError(errorMessage)
      // Return empty array instead of throwing
      setAttempts([])
      return []
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

// Course Topics hooks
export const useCourseTopics = (courseId: string, semesterId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topics, setTopics] = useState<CourseTopic[]>([])

  const fetchTopics = async () => {
    if (!courseId || !semesterId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getCourseTopics(courseId, semesterId)
      setTopics(data)
      return data
    } catch (err: any) {
      console.error("Error fetching course topics:", err)
      const errorMessage = err.response?.data?.message || "Failed to fetch course topics. Please try again."
      setError(errorMessage)
      // Return empty array instead of throwing to prevent cascading errors
      setTopics([])
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return { topics, loading: isLoading, error, refetch: fetchTopics }
}

export const useCourseTopic = (topicId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topic, setTopic] = useState<CourseTopic | null>(null)

  const fetchTopic = async () => {
    if (!topicId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getCourseTopic(topicId)
      setTopic(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch course topic. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { topic, loading: isLoading, error, refetch: fetchTopic }
}

export const useCourseTopicActions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createCourseTopic = async (data: CreateTopicPayload) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const response = await authApi.createCourseTopic(data)
      setSuccess(true)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create course topic. Please try again."
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { createCourseTopic, isLoading, error, success }
}

export const useUpdateCourseTopic = (topicId: string) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const updateTopic = async (data: UpdateTopicPayload) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await authApi.updateCourseTopic(topicId, data)
      setSuccess(true)
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update course topic. Please try again."
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { updateTopic, loading, error, success }
}

export const useDeleteCourseTopic = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTopic = async (topicId: string) => {
    setLoading(true)
    setError(null)
    try {
      await authApi.deleteCourseTopic(topicId)
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete course topic. Please try again."
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteTopic, loading, error }
}

export const useCreateCourseTopic = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTopic = async (data: CreateTopicPayload) => {
    setLoading(true)
    setError(null)
    try {
      await authApi.createCourseTopic(data)
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create course topic. Please try again."
      setError(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { createTopic, loading, error }
}

// Deprecated - use useCourseDetail instead
export const useCourse = (courseId: string) => {
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { courses } = useCourses()

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setLoading(false)
        return
      }

      try {
        // First check if we already have the course in our courses state
        if (courses && courses.length > 0) {
          const foundCourse = courses.find((c) => c.courseId === courseId)
          if (foundCourse) {
            setCourse(foundCourse)
            setLoading(false)
            return
          }
        }

        // If not found in state, we would fetch it from API
        // For now, we'll just set loading to false and error to indicate course not found
        setError("Course not found")
      } catch (err) {
        setError("Failed to fetch course details")
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId, courses])

  return { course, loading, error }
}

// Course Progress hooks
export const useTopicProgressStatistics = (courseId: string, semesterId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progressStats, setProgressStats] = useState<TopicProgressStatistics[]>([])

  const fetchTopicProgressStatistics = async () => {
    if (!courseId || !semesterId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getTopicProgressStatistics(courseId, semesterId)
      setProgressStats(data)
      return data
    } catch (err: any) {
      console.error("Error fetching topic progress statistics:", err)
      const errorMessage = err.response?.data?.message || "Failed to fetch topic progress statistics. Please try again."
      setError(errorMessage)
      // Return empty array instead of throwing
      setProgressStats([])
      return []
    } finally {
      setIsLoading(false)
    }
  }

  return { progressStats, loading: isLoading, error, refetch: fetchTopicProgressStatistics }
}

export const useStudentTopicProgress = (studentProfileId: string, courseId: string, semesterId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studentProgress, setStudentProgress] = useState<StudentTopicProgress | null>(null)

  const fetchStudentTopicProgress = async () => {
    if (!studentProfileId || !courseId || !semesterId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getStudentTopicProgress(studentProfileId, courseId, semesterId)
      setStudentProgress(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch student topic progress. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { studentProgress, loading: isLoading, error, refetch: fetchStudentTopicProgress }
}

export const useCourseMasteryStatistics = (courseId: string, semesterId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [masteryStats, setMasteryStats] = useState<CourseMasteryStatistics | null>(null)

  const fetchCourseMasteryStatistics = async () => {
    if (!courseId || !semesterId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getCourseMasteryStatistics(courseId, semesterId)
      setMasteryStats(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch course mastery statistics. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { masteryStats, loading: isLoading, error, refetch: fetchCourseMasteryStatistics }
}

export const useCourseStudentMasteries = (courseId: string, semesterId: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studentMasteries, setStudentMasteries] = useState<StudentMastery[]>([])

  const fetchCourseStudentMasteries = async () => {
    if (!courseId || !semesterId) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getCourseStudentMasteries(courseId, semesterId)
      setStudentMasteries(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch student masteries. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { studentMasteries, loading: isLoading, error, refetch: fetchCourseStudentMasteries }
}

// Attendance hooks
export const useAttendance = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  const getAttendanceRecords = async (filters?: AttendanceFilters) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getAttendanceRecords(filters)
      setAttendanceRecords(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch attendance records. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getAttendanceById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getAttendanceById(id)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch attendance record. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getAttendanceRecords, getAttendanceById, attendanceRecords, isLoading, error }
}

export const useAttendanceActions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const createAttendance = async (data: CreateAttendanceRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.createAttendance(data)
      setSuccess("Attendance recorded successfully")
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to record attendance. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const createBulkAttendance = async (data: BulkCreateAttendanceRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.createBulkAttendance(data)
      setSuccess("Bulk attendance recorded successfully")
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to record bulk attendance. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateAttendance = async (id: string, data: UpdateAttendanceRequest) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await authApi.updateAttendance(id, data)
      setSuccess("Attendance updated successfully")
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update attendance. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAttendance = async (id: string) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await authApi.deleteAttendance(id)
      setSuccess("Attendance deleted successfully")
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete attendance. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createAttendance,
    createBulkAttendance,
    updateAttendance,
    deleteAttendance,
    isLoading,
    error,
    success,
    setError,
    setSuccess,
  }
}

export const useAttendanceStatistics = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studentStats, setStudentStats] = useState<AttendanceStatistics | null>(null)
  const [courseSummary, setCourseSummary] = useState<CourseAttendanceSummary | null>(null)

  const getStudentAttendanceStatistics = async (studentProfileId: string, courseId: string, semesterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getStudentAttendanceStatistics(studentProfileId, courseId, semesterId)
      setStudentStats(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch student attendance statistics. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getCourseAttendanceSummary = async (courseId: string, semesterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getCourseAttendanceSummary(courseId, semesterId)
      setCourseSummary(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch course attendance summary. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getStudentAttendanceStatistics,
    getCourseAttendanceSummary,
    studentStats,
    courseSummary,
    isLoading,
    error,
  }
}

// Performance Analytics hooks
export const useStudentPerformances = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [performances, setPerformances] = useState<StudentPerformance[]>([])

  const getStudentPerformances = async (filters?: PerformanceFilterDto) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getStudentPerformances(filters)
      setPerformances(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch student performances. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getStudentPerformances, performances, isLoading, error }
}

export const useStudentPerformance = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [performance, setPerformance] = useState<StudentPerformance | null>(null)

  const getStudentPerformanceById = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getStudentPerformanceById(id)
      setPerformance(data)
      return data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch student performance. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const getStudentCoursePerformance = async (studentProfileId: string, courseId: string, semesterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authApi.getStudentCoursePerformance(studentProfileId, courseId, semesterId)
      setPerformance(data)
      return data
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch student course performance. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getStudentPerformanceById, getStudentCoursePerformance, performance, isLoading, error }
}

export const usePerformanceAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [studentAnalysis, setStudentAnalysis] = useState<StudentPerformance | null>(null)
  const [classAnalysis, setClassAnalysis] = useState<ClassPerformanceAnalysis | null>(null)

  const generateStudentAnalysis = async (data: GenerateAnalysisRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.generateStudentAnalysis(data)
      setStudentAnalysis(response)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to generate student analysis. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const generateClassAnalysis = async (data: GenerateClassAnalysisRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authApi.generateClassAnalysis(data)
      setClassAnalysis(response)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to generate class analysis. Please try again."
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateStudentAnalysis,
    generateClassAnalysis,
    studentAnalysis,
    classAnalysis,
    isLoading,
    error,
  }
}
