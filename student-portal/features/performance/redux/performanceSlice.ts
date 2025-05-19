import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PerformanceData } from "@/features/performance/types"
import { performanceService } from "../services/perfomance-service"

interface PerformanceState {
  performanceData: PerformanceData[]
  isLoading: boolean
  error: string | null
}

const initialState: PerformanceState = {
  performanceData: [],
  isLoading: false,
  error: null,
}

export const fetchPerformanceData = createAsyncThunk<
  PerformanceData[],
  { studentProfileId: string; courseId: string; semesterId: string; token: string }
>("performance/fetchData", async ({ studentProfileId, courseId, semesterId, token }, { rejectWithValue }) => {
  try {
    const data = await performanceService.getPerformanceData(studentProfileId, courseId, semesterId, token)
    return data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    clearPerformanceData: (state) => {
      state.performanceData = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPerformanceData.fulfilled, (state, action) => {
        state.isLoading = false
        state.performanceData = action.payload
      })
      .addCase(fetchPerformanceData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearPerformanceData } = performanceSlice.actions
export default performanceSlice.reducer
