import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { attendanceService } from "@/lib/services/attendance.service"
import type { AttendanceState } from "@/lib/types/attendance.types"
import type { RootState } from "@/lib/redux/store"

const initialState: AttendanceState = {
  attendanceRecords: [],
  isLoading: false,
  error: null,
}

export const fetchAttendanceRecords = createAsyncThunk(
  "attendance/fetchAttendanceRecords",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const attendanceRecords = await attendanceService.getAttendanceRecords(studentProfile.id, accessToken)
      return attendanceRecords
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch attendance records")
    }
  },
)

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceRecords.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAttendanceRecords.fulfilled, (state, action) => {
        state.isLoading = false
        state.attendanceRecords = action.payload
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAttendanceError } = attendanceSlice.actions
export default attendanceSlice.reducer
