import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { academicRecordsService } from "@/features/academic-records/services/academic-records-service"
import type { AcademicRecord } from "@/features/academic-records/types"

interface AcademicRecordsState {
  records: AcademicRecord[]
  isLoading: boolean
  error: string | null
}

const initialState: AcademicRecordsState = {
  records: [],
  isLoading: false,
  error: null,
}

export const fetchAcademicRecords = createAsyncThunk<AcademicRecord[], { studentProfileId: string; token: string }>(
  "academicRecords/fetchRecords",
  async ({ studentProfileId, token }, { rejectWithValue }) => {
    try {
      const data = await academicRecordsService.getAcademicRecords(studentProfileId, token)
      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

const academicRecordsSlice = createSlice({
  name: "academicRecords",
  initialState,
  reducers: {
    clearAcademicRecords: (state) => {
      state.records = []
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
        state.records = action.payload
      })
      .addCase(fetchAcademicRecords.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearAcademicRecords } = academicRecordsSlice.actions
export default academicRecordsSlice.reducer
