import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { academicRecordService } from "@/lib/services/academic-record.service"
import type { AcademicRecordState } from "@/lib/types/academic-record.types"
import type { RootState } from "@/lib/redux/store"

const initialState: AcademicRecordState = {
  academicRecords: [],
  isLoading: false,
  error: null,
}

export const fetchAcademicRecords = createAsyncThunk(
  "academicRecord/fetchAcademicRecords",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const academicRecords = await academicRecordService.getAcademicRecords(studentProfile.id, accessToken)
      return academicRecords
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch academic records")
    }
  },
)

const academicRecordSlice = createSlice({
  name: "academicRecord",
  initialState,
  reducers: {
    clearAcademicRecordError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicRecords.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAcademicRecords.fulfilled, (state, action) => {
        state.isLoading = false
        state.academicRecords = action.payload
      })
      .addCase(fetchAcademicRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAcademicRecordError } = academicRecordSlice.actions
export default academicRecordSlice.reducer
