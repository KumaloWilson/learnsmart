import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { attendanceApi } from "@/lib/api/attendance-api"

export interface Attendance {
  id: string
  studentId: string
  studentName?: string
  courseId: string
  courseName?: string
  date: string
  isPresent: boolean
  createdAt?: string
  updatedAt?: string
}

export interface VirtualClassAttendance {
  id: string
  studentId: string
  studentName?: string
  virtualClassId: string
  virtualClassName?: string
  joinTime: string
  leaveTime?: string
  duration?: number
  createdAt?: string
  updatedAt?: string
}

interface AttendanceState {
  physicalAttendance: Attendance[]
  virtualAttendance: VirtualClassAttendance[]
  isLoading: boolean
  error: string | null
}

const initialState: AttendanceState = {
  physicalAttendance: [],
  virtualAttendance: [],
  isLoading: false,
  error: null,
}

export const fetchPhysicalAttendance = createAsyncThunk(
  "attendance/fetchPhysicalAttendance",
  async ({ courseId, date }: { courseId: string; date?: string }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getPhysicalAttendance(courseId, date)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch physical attendance")
    }
  },
)

export const fetchVirtualAttendance = createAsyncThunk(
  "attendance/fetchVirtualAttendance",
  async (virtualClassId: string, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getVirtualAttendance(virtualClassId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch virtual attendance")
    }
  },
)

export const markPhysicalAttendance = createAsyncThunk(
  "attendance/markPhysicalAttendance",
  async (
    {
      courseId,
      date,
      attendanceData,
    }: { courseId: string; date: string; attendanceData: { studentId: string; isPresent: boolean }[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await attendanceApi.markPhysicalAttendance(courseId, date, attendanceData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark physical attendance")
    }
  },
)

export const updatePhysicalAttendance = createAsyncThunk(
  "attendance/updatePhysicalAttendance",
  async ({ attendanceId, isPresent }: { attendanceId: string; isPresent: boolean }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.updatePhysicalAttendance(attendanceId, isPresent)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update physical attendance")
    }
  },
)

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Physical Attendance
      .addCase(fetchPhysicalAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPhysicalAttendance.fulfilled, (state, action: PayloadAction<Attendance[]>) => {
        state.isLoading = false
        state.physicalAttendance = action.payload
      })
      .addCase(fetchPhysicalAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Virtual Attendance
      .addCase(fetchVirtualAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchVirtualAttendance.fulfilled, (state, action: PayloadAction<VirtualClassAttendance[]>) => {
        state.isLoading = false
        state.virtualAttendance = action.payload
      })
      .addCase(fetchVirtualAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Mark Physical Attendance
      .addCase(markPhysicalAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(markPhysicalAttendance.fulfilled, (state, action: PayloadAction<Attendance[]>) => {
        state.isLoading = false
        state.physicalAttendance = action.payload
      })
      .addCase(markPhysicalAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Physical Attendance
      .addCase(updatePhysicalAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePhysicalAttendance.fulfilled, (state, action: PayloadAction<Attendance>) => {
        state.isLoading = false
        const index = state.physicalAttendance.findIndex((attendance) => attendance.id === action.payload.id)
        if (index !== -1) {
          state.physicalAttendance[index] = action.payload
        }
      })
      .addCase(updatePhysicalAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = attendanceSlice.actions

export default attendanceSlice.reducer
