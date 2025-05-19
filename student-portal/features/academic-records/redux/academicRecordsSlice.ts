import { createSlice } from "@reduxjs/toolkit"
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

const academicRecordsSlice = createSlice({
  name: "academicRecords",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default academicRecordsSlice.reducer
