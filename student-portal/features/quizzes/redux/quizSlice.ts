import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { quizService } from "../services/quiz-service"
import { QuizAnswer, QuizAttempt, StartQuizRequest } from "../types"

// Define the initial state
interface QuizState {
  currentAttempt: QuizAttempt | null
  attempts: QuizAttempt[]
  isLoading: boolean
  error: string | null
  timeRemaining: number | null // in seconds
  isSubmitting: boolean
  isQuizActive: boolean
  answers: QuizAnswer[]
}

const initialState: QuizState = {
  currentAttempt: null,
  attempts: [],
  isLoading: false,
  error: null,
  timeRemaining: null,
  isSubmitting: false,
  isQuizActive: false,
  answers: [],
}

// Create async thunks
export const startQuiz = createAsyncThunk(
  "quiz/startQuiz",
  async ({ quizId, studentProfileId, token }: StartQuizRequest & { token: string }, { rejectWithValue }) => {
    try {
      const response = await quizService.startQuiz({ quizId, studentProfileId }, token)
      return response
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

export const submitQuiz = createAsyncThunk(
  "quiz/submitQuiz",
  async (
    {
      attemptId,
      answers,
      token,
      timedOut = false,
    }: {
      attemptId: string
      answers: QuizAnswer[]
      token: string
      timedOut?: boolean
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await quizService.submitQuiz(attemptId, { answers }, token)
      return { ...response, timedOut }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

export const getQuizAttempt = createAsyncThunk(
  "quiz/getQuizAttempt",
  async ({ attemptId, token }: { attemptId: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await quizService.getQuizAttempt(attemptId, token)
      return response
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

export const getStudentQuizAttempts = createAsyncThunk(
  "quiz/getStudentQuizAttempts",
  async ({ studentProfileId, token }: { studentProfileId: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await quizService.getStudentQuizAttempts(studentProfileId, token)
      return response
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unknown error occurred")
    }
  },
)

// Create the quiz slice
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload
    },
    updateAnswer: (state, action: PayloadAction<QuizAnswer>) => {
      const { questionIndex } = action.payload
      const existingAnswerIndex = state.answers.findIndex((answer) => answer.questionIndex === questionIndex)

      if (existingAnswerIndex !== -1) {
        state.answers[existingAnswerIndex] = action.payload
      } else {
        state.answers.push(action.payload)
      }
    },
    clearCurrentQuiz: (state) => {
      state.currentAttempt = null
      state.timeRemaining = null
      state.isQuizActive = false
      state.answers = []
    },
    setQuizActive: (state, action: PayloadAction<boolean>) => {
      state.isQuizActive = action.payload
    },
    resetQuizState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Start quiz
      .addCase(startQuiz.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAttempt = action.payload
        state.isQuizActive = true
        state.timeRemaining = action.payload.quiz.timeLimit * 60 // Convert minutes to seconds
        state.answers = []
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Submit quiz
      .addCase(submitQuiz.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.isQuizActive = false
        state.currentAttempt = action.payload
        state.timeRemaining = null

        // Add the submitted attempt to the attempts array
        const existingAttemptIndex = state.attempts.findIndex((attempt) => attempt.id === action.payload.id)

        if (existingAttemptIndex !== -1) {
          state.attempts[existingAttemptIndex] = action.payload
        } else {
          state.attempts.push(action.payload)
        }
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
      })
      // Get quiz attempt
      .addCase(getQuizAttempt.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false

        // If the attempt is in progress, set it as the current attempt
        if (action.payload.status === "in_progress") {
          state.currentAttempt = action.payload
          state.isQuizActive = true

          // Calculate remaining time
          if (action.payload.quiz?.timeLimit) {
            const startTime = new Date(action.payload.startTime).getTime()
            const currentTime = new Date().getTime()
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000)
            const totalSeconds = action.payload.quiz.timeLimit * 60
            const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

            state.timeRemaining = remainingSeconds
          }
        }

        // Update the attempt in the attempts array
        const existingAttemptIndex = state.attempts.findIndex((attempt) => attempt.id === action.payload.id)

        if (existingAttemptIndex !== -1) {
          state.attempts[existingAttemptIndex] = action.payload
        } else {
          state.attempts.push(action.payload)
        }
      })
      .addCase(getQuizAttempt.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get student quiz attempts
      .addCase(getStudentQuizAttempts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getStudentQuizAttempts.fulfilled, (state, action) => {
        state.isLoading = false
        state.attempts = action.payload

        // Check if there's an in-progress attempt
        const inProgressAttempt = action.payload.find((attempt) => attempt.status === "in_progress")

        if (inProgressAttempt) {
          state.currentAttempt = inProgressAttempt
          state.isQuizActive = true

          // Calculate remaining time
          if (inProgressAttempt.quiz?.timeLimit) {
            const startTime = new Date(inProgressAttempt.startTime).getTime()
            const currentTime = new Date().getTime()
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000)
            const totalSeconds = inProgressAttempt.quiz.timeLimit * 60
            const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds)

            state.timeRemaining = remainingSeconds
          }
        }
      })
      .addCase(getStudentQuizAttempts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setTimeRemaining, updateAnswer, clearCurrentQuiz, setQuizActive, resetQuizState } = quizSlice.actions

export default quizSlice.reducer
