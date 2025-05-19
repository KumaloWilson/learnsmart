import { createSlice } from "@reduxjs/toolkit"
import type { AttendanceRecord } from "@/features/attendance/types"

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

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default attendanceSlice.reducer
