import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { quizHistoryService } from "@/lib/services/quiz-history.service"
import type { QuizHistoryState } from "@/lib/types/quiz-history.types"
import type { RootState } from "@/lib/redux/store"

const initialState: QuizHistoryState = {
  quizAttempts: [],
  isLoading: false,
  error: null,
}

export const fetchQuizAttempts = createAsyncThunk(
  "quizHistory/fetchQuizAttempts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const quizAttempts = await quizHistoryService.getQuizAttempts(studentProfile.id, accessToken)
      return quizAttempts
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch quiz attempts")
    }
  },
)

export const fetchQuizAttempt = createAsyncThunk(
  "quizHistory/fetchQuizAttempt",
  async (attemptId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const quizAttempt = await quizHistoryService.getQuizAttempt(studentProfile.id, attemptId, accessToken)
      return quizAttempt
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch quiz attempt")
    }
  },
)

const quizHistorySlice = createSlice({
  name: "quizHistory",
  initialState,
  reducers: {
    clearQuizHistoryError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizAttempts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchQuizAttempts.fulfilled, (state, action) => {
        state.isLoading = false
        state.quizAttempts = action.payload
      })
      .addCase(fetchQuizAttempts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchQuizAttempt.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false
        // Add or update the quiz attempt in the array
        const index = state.quizAttempts.findIndex((attempt) => attempt.id === action.payload.id)
        if (index >= 0) {
          state.quizAttempts[index] = action.payload
        } else {
          state.quizAttempts.push(action.payload)
        }
      })
      .addCase(fetchQuizAttempt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearQuizHistoryError } = quizHistorySlice.actions
export default quizHistorySlice.reducer
