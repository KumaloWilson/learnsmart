import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { studentService } from "@/lib/services/student.service"
import type { DashboardData } from "@/lib/types/dashboard.types"
import type { RootState } from "@/lib/redux/store"

interface DashboardState {
  data: DashboardData | null
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
}

export const fetchDashboard = createAsyncThunk("dashboard/fetchDashboard", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const { studentProfile, accessToken } = state.auth

    if (!studentProfile || !accessToken) {
      return rejectWithValue("Authentication required")
    }

    const dashboardData = await studentService.getDashboard(studentProfile.id, accessToken)
    return dashboardData
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("Failed to fetch dashboard data")
  }
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearDashboardError } = dashboardSlice.actions
export default dashboardSlice.reducer
