import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { DashboardData } from "../types"

import { dashboardService } from "../services/dashboard-service"

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

export const fetchDashboardData = createAsyncThunk<DashboardData, { studentProfileId: string; token: string }>(
  "dashboard/fetchData",
  async ({ studentProfileId, token }, { rejectWithValue }) => {
    try {
      const data = await dashboardService.getDashboardData(studentProfileId, token)
      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false
        state.data = action.payload
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default dashboardSlice.reducer
