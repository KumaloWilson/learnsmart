import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { assessmentService } from "@/lib/services/assessment.service"
import { authService } from "@/lib/services/auth.service"

export const fetchAssessments = createAsyncThunk("assessment/fetchAssessments", async (_, { rejectWithValue }) => {
  try {
    const authData = authService.getStoredAuthData()
    if (!authData || !authData.studentProfile) {
      return rejectWithValue("Authentication data not found")
    }

    const assessments = await assessmentService.getAssessments(authData.studentProfile.id, authData.accessToken)
    return assessments
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("Failed to fetch assessments")
  }
})

const initialState = {
  assessments: [],
  isLoading: false,
  error: null,
}

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAssessments.fulfilled, (state, action) => {
        state.isLoading = false
        state.assessments = action.payload
      })
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export default assessmentSlice.reducer
