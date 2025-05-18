import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { performanceService } from "@/lib/services/performance.service"
import type { PerformanceState } from "@/lib/types/performance.types"
import type { RootState } from "@/lib/redux/store"

const initialState: PerformanceState = {
  coursePerformance: [],
  isLoading: false,
  error: null,
}

export const fetchCoursePerformance = createAsyncThunk(
  "performance/fetchCoursePerformance",
  async ({ courseId, semesterId }: { courseId: string; semesterId: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const performanceData = await performanceService.getCoursePerformance(
        studentProfile.id,
        courseId,
        semesterId,
        accessToken,
      )
      return performanceData
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch course performance data")
    }
  },
)

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    clearPerformanceError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoursePerformance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCoursePerformance.fulfilled, (state, action) => {
        state.isLoading = false
        state.coursePerformance = action.payload
      })
      .addCase(fetchCoursePerformance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearPerformanceError } = performanceSlice.actions
export default performanceSlice.reducer
