import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { DashboardOverview, EnrollmentData, UserActivity, RecentActivity, SystemHealth } from "@/types/dashboard"
import dashboardService from "@/lib/dashboard-service"

interface DashboardState {
  overview: DashboardOverview | null
  enrollments: EnrollmentData | null
  userActivity: UserActivity | null
  recentActivity: RecentActivity | null
  systemHealth: SystemHealth | null
  isLoading: {
    overview: boolean
    enrollments: boolean
    userActivity: boolean
    recentActivity: boolean
    systemHealth: boolean
  }
  error: string | null
}

const initialState: DashboardState = {
  overview: {
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
  enrollments: null,
  userActivity: null,
  recentActivity: null,
  systemHealth: null,
  isLoading: {
    overview: false,
    enrollments: false,
    userActivity: false,
    recentActivity: false,
    systemHealth: false,
  },
  error: null,
}

export const fetchOverview = createAsyncThunk("dashboard/fetchOverview", async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getOverview()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch overview")
  }
})

export const fetchEnrollments = createAsyncThunk("dashboard/fetchEnrollments", async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getEnrollments()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch enrollments")
  }
})

export const fetchUserActivity = createAsyncThunk("dashboard/fetchUserActivity", async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getUserActivity()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch user activity")
  }
})

export const fetchRecentActivity = createAsyncThunk("dashboard/fetchRecentActivity", async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getRecentActivity()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch recent activity")
  }
})

export const fetchSystemHealth = createAsyncThunk("dashboard/fetchSystemHealth", async (_, { rejectWithValue }) => {
  try {
    return await dashboardService.getSystemHealth()
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch system health")
  }
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchOverview.pending, (state) => {
        state.isLoading.overview = true
        state.error = null
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.isLoading.overview = false
        state.overview = action.payload
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.isLoading.overview = false
        state.error = action.payload as string
      })

      // Enrollments
      .addCase(fetchEnrollments.pending, (state) => {
        state.isLoading.enrollments = true
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.isLoading.enrollments = false
        state.enrollments = action.payload
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.isLoading.enrollments = false
        state.error = action.payload as string
      })

      // User Activity
      .addCase(fetchUserActivity.pending, (state) => {
        state.isLoading.userActivity = true
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.isLoading.userActivity = false
        state.userActivity = action.payload
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.isLoading.userActivity = false
        state.error = action.payload as string
      })

      // Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.isLoading.recentActivity = true
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.isLoading.recentActivity = false
        state.recentActivity = action.payload
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.isLoading.recentActivity = false
        state.error = action.payload as string
      })

      // System Health
      .addCase(fetchSystemHealth.pending, (state) => {
        state.isLoading.systemHealth = true
      })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.isLoading.systemHealth = false
        state.systemHealth = action.payload
      })
      .addCase(fetchSystemHealth.rejected, (state, action) => {
        state.isLoading.systemHealth = false
        state.error = action.payload as string
      })
  },
})

export default dashboardSlice.reducer
