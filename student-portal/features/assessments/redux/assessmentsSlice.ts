import { createSlice } from "@reduxjs/toolkit"
import type { Assessment } from "@/features/assessments/types"

interface AssessmentsState {
  assessments: Assessment[]
  isLoading: boolean
  error: string | null
}

const initialState: AssessmentsState = {
  assessments: [],
  isLoading: false,
  error: null,
}

const assessmentsSlice = createSlice({
  name: "assessments",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default assessmentsSlice.reducer
