import { createSlice } from "@reduxjs/toolkit"
import type { QuizAttempt } from "@/features/quiz-history/types"

interface QuizHistoryState {
  attempts: QuizAttempt[]
  isLoading: boolean
  error: string | null
}

const initialState: QuizHistoryState = {
  attempts: [],
  isLoading: false,
  error: null,
}

const quizHistorySlice = createSlice({
  name: "quizHistory",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default quizHistorySlice.reducer
