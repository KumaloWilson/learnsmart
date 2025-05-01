import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { dashboardApi } from "@/lib/api"

interface DashboardStats {
  totalStudents: number
  totalLecturers: number
  totalCourses: number
  totalPrograms: number
  activeStudents: number
  activeLecturers: number
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    userId: string
    userName: string
  }>
  courseEnrollmentData: Array<{
    courseId: string
    courseName: string
    enrollmentCount: number
  }>
  atRiskStudentsData: Array<{
    programId: string
    programName: string
    atRiskCount: number
    totalStudents: number
  }>
}

interface DashboardState {
  stats: DashboardStats | null
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  stats: null,
  isLoading: false,
  error: null,
}

export const fetchDashboardStats = createAsyncThunk("dashboard/fetchDashboardStats", async (_, { rejectWithValue }) => {
  try {
    const response = await dashboardApi.getDashboardStats()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch dashboard stats")
  }
})

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
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<DashboardStats>) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = dashboardSlice.actions

export default dashboardSlice.reducer
