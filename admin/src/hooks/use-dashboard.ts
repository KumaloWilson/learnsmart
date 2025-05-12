import { useSelector, useDispatch } from "react-redux"
import { useCallback } from "react"
import type { RootState, AppDispatch } from "@/lib/store"
import {
  fetchOverview,
  fetchEnrollments,
  fetchUserActivity,
  fetchRecentActivity,
  fetchSystemHealth,
} from "@/lib/redux/dashboardSlice"

export const useDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const dashboardState = useSelector((state: RootState) => state.dashboard)

  // Provide default values to prevent null access
  
  const {
    overview = {
      totalStudents: 0,
      totalLecturers: 0,
      totalCourses: 0,
      totalPrograms: 0,
      totalDepartments: 0,
      totalSchools: 0,
      activeStudents: 0,
      activeLecturers: 0,
      recentEnrollments: 0,
      upcomingAssessments: 0,
    },
    enrollments = null,
    userActivity = null,
    recentActivity = null,
    systemHealth = null,
    isLoading = {
      overview: false,
      enrollments: false,
      userActivity: false,
      recentActivity: false,
      systemHealth: false,
    },
    error = null,
  } = dashboardState || {}

  const loadOverview = useCallback(async () => {
    try {
      return await dispatch(fetchOverview()).unwrap()
    } catch (error) {
      console.error("Failed to load overview:", error)
      return null
    }
  }, [dispatch])

  const loadEnrollments = useCallback(async () => {
    try {
      return await dispatch(fetchEnrollments()).unwrap()
    } catch (error) {
      console.error("Failed to load enrollments:", error)
      return null
    }
  }, [dispatch])

  const loadUserActivity = useCallback(async () => {
    try {
      return await dispatch(fetchUserActivity()).unwrap()
    } catch (error) {
      console.error("Failed to load user activity:", error)
      return null
    }
  }, [dispatch])

  const loadRecentActivity = useCallback(async () => {
    try {
      return await dispatch(fetchRecentActivity()).unwrap()
    } catch (error) {
      console.error("Failed to load recent activity:", error)
      return null
    }
  }, [dispatch])

  const loadSystemHealth = useCallback(async () => {
    try {
      return await dispatch(fetchSystemHealth()).unwrap()
    } catch (error) {
      console.error("Failed to load system health:", error)
      return null
    }
  }, [dispatch])

  const loadAllDashboardData = useCallback(async () => {
    try {
      await Promise.all([
        dispatch(fetchOverview()),
        dispatch(fetchEnrollments()),
        dispatch(fetchUserActivity()),
        dispatch(fetchRecentActivity()),
        dispatch(fetchSystemHealth()),
      ])
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    }
  }, [dispatch])

  return {
    overview,
    enrollments,
    userActivity,
    recentActivity,
    systemHealth,
    isLoading,
    error,
    loadOverview,
    loadEnrollments,
    loadUserActivity,
    loadRecentActivity,
    loadSystemHealth,
    loadAllDashboardData,
  }
}