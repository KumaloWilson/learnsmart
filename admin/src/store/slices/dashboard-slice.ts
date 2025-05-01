import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { dashboardApi, DashboardStatsDto, EnrollmentStatsDto, CourseStatsDto, RecentActivityDto, AcademicPerformanceDto } from "@/lib/api/dashboard-api"

interface DashboardState {
  overviewStats: DashboardStatsDto | null
  enrollmentStats: EnrollmentStatsDto | null
  courseStats: CourseStatsDto | null
  academicPerformance: AcademicPerformanceDto | null
  recentActivity: RecentActivityDto | null
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  overviewStats: null,
  enrollmentStats: null,
  courseStats: null,
  academicPerformance: null,
  recentActivity: null,
  isLoading: false,
  error: null,
}

export const fetchOverviewStats = createAsyncThunk(
  "dashboard/fetchOverviewStats", 
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getOverviewStats()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch overview stats")
    }
  }
)

export const fetchEnrollmentStats = createAsyncThunk(
  "dashboard/fetchEnrollmentStats", 
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getEnrollmentStats()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch enrollment stats")
    }
  }
)

export const fetchCourseStats = createAsyncThunk(
  "dashboard/fetchCourseStats", 
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getCourseStats()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch course stats")
    }
  }
)

export const fetchAcademicPerformance = createAsyncThunk(
  "dashboard/fetchAcademicPerformance", 
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getAcademicPerformance()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch academic performance data")
    }
  }
)

export const fetchRecentActivity = createAsyncThunk(
  "dashboard/fetchRecentActivity", 
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      return await dashboardApi.getRecentActivity(limit)
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch recent activity")
    }
  }
)

export const fetchAllDashboardData = createAsyncThunk(
  "dashboard/fetchAllDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardApi.getAllDashboardData()
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch dashboard data")
    }
  }
)

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview Stats
      .addCase(fetchOverviewStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOverviewStats.fulfilled, (state, action: PayloadAction<DashboardStatsDto>) => {
        state.isLoading = false
        state.overviewStats = action.payload
      })
      .addCase(fetchOverviewStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Enrollment Stats
      .addCase(fetchEnrollmentStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchEnrollmentStats.fulfilled, (state, action: PayloadAction<EnrollmentStatsDto>) => {
        state.isLoading = false
        state.enrollmentStats = action.payload
      })
      .addCase(fetchEnrollmentStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Course Stats
      .addCase(fetchCourseStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCourseStats.fulfilled, (state, action: PayloadAction<CourseStatsDto>) => {
        state.isLoading = false
        state.courseStats = action.payload
      })
      .addCase(fetchCourseStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Academic Performance
      .addCase(fetchAcademicPerformance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAcademicPerformance.fulfilled, (state, action: PayloadAction<AcademicPerformanceDto>) => {
        state.isLoading = false
        state.academicPerformance = action.payload
      })
      .addCase(fetchAcademicPerformance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action: PayloadAction<RecentActivityDto>) => {
        state.isLoading = false
        state.recentActivity = action.payload
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      
      // All Dashboard Data
      .addCase(fetchAllDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllDashboardData.fulfilled, (state, action) => {
        state.isLoading = false
        state.overviewStats = action.payload.overview
        state.enrollmentStats = action.payload.enrollments
        state.academicPerformance = action.payload.performance
        state.courseStats = action.payload.courseStats
        state.recentActivity = action.payload.recentActivity
      })
      .addCase(fetchAllDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = dashboardSlice.actions

export default dashboardSlice.reducer