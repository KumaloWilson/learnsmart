import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { AttendanceRecord } from "@/features/attendance/types"
import { attendanceService } from "../services/attendance-service"

interface AttendanceState {
  records: AttendanceRecord[]
  isLoading: boolean
  error: string | null
}

const initialState: AttendanceState = {
  records: [],
  isLoading: false,
  error: null,
}

export const fetchAttendanceRecords = createAsyncThunk<AttendanceRecord[], { studentProfileId: string; token: string }>(
  "attendance/fetchRecords",
  async ({ studentProfileId, token }, { rejectWithValue }) => {
    try {
      const data = await attendanceService.getAttendanceRecords(studentProfileId, token)
      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendanceRecords: (state) => {
      state.records = []
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
        state.records = action.payload
      })
      .addCase(fetchAttendanceRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAttendanceRecords } = attendanceSlice.actions
export default attendanceSlice.reducer
