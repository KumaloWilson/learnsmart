import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { quizzesApi } from "@/lib/api/quizzes-api"

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
  questionId: string
}

export interface QuizQuestion {
  id: string
  text: string
  type: string
  points: number
  quizId: string
  options: QuizOption[]
}

export interface Quiz {
  id: string
  title: string
  description: string
  timeLimit: number
  passingScore: number
  isPublished: boolean
  courseId: string
  courseName?: string
  createdAt?: string
  updatedAt?: string
  questions?: QuizQuestion[]
}

interface QuizzesState {
  quizzes: Quiz[]
  currentQuiz: Quiz | null
  isLoading: boolean
  error: string | null
}

const initialState: QuizzesState = {
  quizzes: [],
  currentQuiz: null,
  isLoading: false,
  error: null,
}

export const fetchQuizzes = createAsyncThunk("quizzes/fetchQuizzes", async (_, { rejectWithValue }) => {
  try {
    const response = await quizzesApi.getQuizzes()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch quizzes")
  }
})

export const fetchQuizzesByCourse = createAsyncThunk(
  "quizzes/fetchQuizzesByCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.getQuizzesByCourse(courseId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch quizzes for this course")
    }
  },
)

export const fetchQuizById = createAsyncThunk("quizzes/fetchQuizById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await quizzesApi.getQuizById(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch quiz")
  }
})

export const createQuiz = createAsyncThunk(
  "quizzes/createQuiz",
  async (quizData: Omit<Quiz, "id">, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.createQuiz(quizData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create quiz")
    }
  },
)

export const updateQuiz = createAsyncThunk(
  "quizzes/updateQuiz",
  async ({ id, quizData }: { id: string; quizData: Partial<Quiz> }, { rejectWithValue }) => {
    try {
      const response = await quizzesApi.updateQuiz(id, quizData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update quiz")
    }
  },
)

export const deleteQuiz = createAsyncThunk("quizzes/deleteQuiz", async (id: string, { rejectWithValue }) => {
  try {
    await quizzesApi.deleteQuiz(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete quiz")
  }
})

export const publishQuiz = createAsyncThunk("quizzes/publishQuiz", async (id: string, { rejectWithValue }) => {
  try {
    const response = await quizzesApi.publishQuiz(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to publish quiz")
  }
})

export const addQuizQuestion = createAsyncThunk(
  "quizzes/addQuizQuestion",
  async (
    { quizId, questionData }: { quizId: string; questionData: Omit<QuizQuestion, "id" | "quizId"> },
    { rejectWithValue },
  ) => {
    try {
      const response = await quizzesApi.addQuizQuestion(quizId, questionData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add question")
    }
  },
)

export const updateQuizQuestion = createAsyncThunk(
  "quizzes/updateQuizQuestion",
  async (
    { questionId, questionData }: { questionId: string; questionData: Partial<QuizQuestion> },
    { rejectWithValue },
  ) => {
    try {
      const response = await quizzesApi.updateQuizQuestion(questionId, questionData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update question")
    }
  },
)

export const deleteQuizQuestion = createAsyncThunk(
  "quizzes/deleteQuizQuestion",
  async ({ quizId, questionId }: { quizId: string; questionId: string }, { rejectWithValue }) => {
    try {
      await quizzesApi.deleteQuizQuestion(questionId)
      return { quizId, questionId }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete question")
    }
  },
)

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quizzes
      .addCase(fetchQuizzes.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchQuizzes.fulfilled, (state, action: PayloadAction<Quiz[]>) => {
        state.isLoading = false
        state.quizzes = action.payload
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Quizzes By Course
      .addCase(fetchQuizzesByCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchQuizzesByCourse.fulfilled, (state, action: PayloadAction<Quiz[]>) => {
        state.isLoading = false
        state.quizzes = action.payload
      })
      .addCase(fetchQuizzesByCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Quiz By Id
      .addCase(fetchQuizById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchQuizById.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false
        state.currentQuiz = action.payload
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Quiz
      .addCase(createQuiz.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false
        state.quizzes.push(action.payload)
        state.currentQuiz = action.payload
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Quiz
      .addCase(updateQuiz.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false
        const index = state.quizzes.findIndex((quiz) => quiz.id === action.payload.id)
        if (index !== -1) {
          state.quizzes[index] = action.payload
        }
        state.currentQuiz = action.payload
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Quiz
      .addCase(deleteQuiz.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.quizzes = state.quizzes.filter((quiz) => quiz.id !== action.payload)
        if (state.currentQuiz?.id === action.payload) {
          state.currentQuiz = null
        }
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Publish Quiz
      .addCase(publishQuiz.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(publishQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.isLoading = false
        const index = state.quizzes.findIndex((quiz) => quiz.id === action.payload.id)
        if (index !== -1) {
          state.quizzes[index] = action.payload
        }
        if (state.currentQuiz?.id === action.payload.id) {
          state.currentQuiz = action.payload
        }
      })
      .addCase(publishQuiz.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add Quiz Question
      .addCase(addQuizQuestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addQuizQuestion.fulfilled, (state, action: PayloadAction<QuizQuestion>) => {
        state.isLoading = false
        if (state.currentQuiz && state.currentQuiz.id === action.payload.quizId) {
          if (!state.currentQuiz.questions) {
            state.currentQuiz.questions = []
          }
          state.currentQuiz.questions.push(action.payload)
        }
      })
      .addCase(addQuizQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Quiz Question
      .addCase(updateQuizQuestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateQuizQuestion.fulfilled, (state, action: PayloadAction<QuizQuestion>) => {
        state.isLoading = false
        if (state.currentQuiz && state.currentQuiz.questions) {
          const index = state.currentQuiz.questions.findIndex((question) => question.id === action.payload.id)
          if (index !== -1) {
            state.currentQuiz.questions[index] = action.payload
          }
        }
      })
      .addCase(updateQuizQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Quiz Question
      .addCase(deleteQuizQuestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteQuizQuestion.fulfilled, (state, action: PayloadAction<{ quizId: string; questionId: string }>) => {
        state.isLoading = false
        if (state.currentQuiz && state.currentQuiz.id === action.payload.quizId && state.currentQuiz.questions) {
          state.currentQuiz.questions = state.currentQuiz.questions.filter(
            (question) => question.id !== action.payload.questionId,
          )
        }
      })
      .addCase(deleteQuizQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentQuiz, clearError } = quizzesSlice.actions

export default quizzesSlice.reducer
