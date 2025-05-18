import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { quizService } from "@/lib/services/quiz.service"
import type { QuizState, QuizAttempt, QuizAnswer, QuizSubmission } from "@/lib/types/quiz.types"
import type { RootState } from "@/lib/redux/store"

const QUIZ_STORAGE_KEY = "learnsmart_quiz_attempt"
const QUIZ_TIMER_KEY = "learnsmart_quiz_timer"
const QUIZ_ANSWERS_KEY = "learnsmart_quiz_answers"

// Helper function to save quiz state to localStorage
const saveQuizToStorage = (attempt: QuizAttempt, timeRemaining: number, answers: QuizAnswer[]) => {
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(attempt))
  localStorage.setItem(QUIZ_TIMER_KEY, timeRemaining.toString())
  localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(answers))
}

// Helper function to clear quiz state from localStorage
const clearQuizFromStorage = () => {
  localStorage.removeItem(QUIZ_STORAGE_KEY)
  localStorage.removeItem(QUIZ_TIMER_KEY)
  localStorage.removeItem(QUIZ_ANSWERS_KEY)
}

// Helper function to load quiz state from localStorage
const loadQuizFromStorage = (): {
  attempt: QuizAttempt | null
  timeRemaining: number | null
  answers: QuizAnswer[]
} => {
  const attemptJson = localStorage.getItem(QUIZ_STORAGE_KEY)
  const timeRemainingStr = localStorage.getItem(QUIZ_TIMER_KEY)
  const answersJson = localStorage.getItem(QUIZ_ANSWERS_KEY)

  return {
    attempt: attemptJson ? JSON.parse(attemptJson) : null,
    timeRemaining: timeRemainingStr ? Number.parseInt(timeRemainingStr, 10) : null,
    answers: answersJson ? JSON.parse(answersJson) : [],
  }
}

const initialState: QuizState = {
  currentAttempt: null,
  isLoading: false,
  error: null,
  timeRemaining: null,
  currentQuestionIndex: 0,
  answers: [],
  isSubmitting: false,
  submissionResult: null,
}

export const startQuiz = createAsyncThunk("quiz/startQuiz", async (quizId: string, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const { studentProfile, accessToken } = state.auth

    if (!studentProfile || !accessToken) {
      return rejectWithValue("Authentication required")
    }

    // Check if there's a cached quiz attempt
    const { attempt, timeRemaining, answers } = loadQuizFromStorage()

    if (attempt && attempt.quizId === quizId && attempt.status === "in_progress") {
      // Return the cached attempt
      return { attempt, timeRemaining, answers }
    }

    // Start a new quiz attempt
    const quizAttempt = await quizService.startQuiz(quizId, studentProfile.id, accessToken)

    // Calculate initial time remaining in seconds
    const initialTimeRemaining = quizAttempt.quiz.timeLimit * 60

    // Save to localStorage
    saveQuizToStorage(quizAttempt, initialTimeRemaining, [])

    return { attempt: quizAttempt, timeRemaining: initialTimeRemaining, answers: [] }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("Failed to start quiz")
  }
})

export const submitQuiz = createAsyncThunk("quiz/submitQuiz", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState
    const { accessToken } = state.auth
    const { currentAttempt, answers } = state.quiz

    if (!accessToken || !currentAttempt) {
      return rejectWithValue("Authentication required or no active quiz")
    }

    const submission: QuizSubmission = { answers }
    const result = await quizService.submitQuiz(currentAttempt.id, submission, accessToken)

    // Clear quiz data from localStorage after successful submission
    clearQuizFromStorage()

    return result
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("Failed to submit quiz")
  }
})

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    updateTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload

      // Update localStorage if we have an active quiz
      if (state.currentAttempt) {
        localStorage.setItem(QUIZ_TIMER_KEY, action.payload.toString())
      }
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload
    },
    saveAnswer: (state, action) => {
      const { questionIndex, selectedOption, type } = action.payload

      // Find if this question has already been answered
      const existingAnswerIndex = state.answers.findIndex((a) => a.questionIndex === questionIndex)

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        state.answers[existingAnswerIndex].selectedOption = selectedOption
      } else {
        // Add new answer
        state.answers.push({ questionIndex, selectedOption, type })
      }

      // Update localStorage
      if (state.currentAttempt) {
        localStorage.setItem(QUIZ_ANSWERS_KEY, JSON.stringify(state.answers))
      }
    },
    resetQuiz: (state) => {
      clearQuizFromStorage()
      return initialState
    },
    loadCachedQuiz: (state) => {
      const { attempt, timeRemaining, answers } = loadQuizFromStorage()

      if (attempt && timeRemaining !== null) {
        state.currentAttempt = attempt
        state.timeRemaining = timeRemaining
        state.answers = answers
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startQuiz.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(startQuiz.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentAttempt = action.payload.attempt
        state.timeRemaining = action.payload.timeRemaining
        state.answers = action.payload.answers
        state.currentQuestionIndex = 0
        state.submissionResult = null
      })
      .addCase(startQuiz.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(submitQuiz.pending, (state) => {
        state.isSubmitting = true
        state.error = null
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.submissionResult = action.payload
        state.currentAttempt = null
        state.timeRemaining = null
        state.answers = []
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.isSubmitting = false
        state.error = action.payload as string
      })
  },
})

export const { updateTimeRemaining, setCurrentQuestionIndex, saveAnswer, resetQuiz, loadCachedQuiz } = quizSlice.actions
export default quizSlice.reducer
