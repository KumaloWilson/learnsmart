import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Recommendation, GenerateRecommendationsRequest } from "@/features/ai-recommendations/types"
import { recommendationsService } from "../services/recommendation-service"

interface AIRecommendationsState {
  recommendations: Recommendation[]
  isLoading: boolean
  isGenerating: boolean
  error: string | null
}

const initialState: AIRecommendationsState = {
  recommendations: [],
  isLoading: false,
  isGenerating: false,
  error: null,
}

export const fetchRecommendations = createAsyncThunk<Recommendation[], { studentProfileId: string; token: string }>(
  "aiRecommendations/fetchAll",
  async ({ studentProfileId, token }, { rejectWithValue }) => {
    try {
      const data = await recommendationsService.getRecommendations(studentProfileId, token)
      return data
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

export const generateRecommendations = createAsyncThunk<
  Recommendation[],
  { request: GenerateRecommendationsRequest; token: string }
>("aiRecommendations/generate", async ({ request, token }, { rejectWithValue }) => {
  try {
    const data = await recommendationsService.generateRecommendations(request, token)
    return data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

export const markRecommendationAsViewed = createAsyncThunk<
  { recommendationId: string },
  { studentProfileId: string; recommendationId: string; token: string }
>("aiRecommendations/markAsViewed", async ({ studentProfileId, recommendationId, token }, { rejectWithValue }) => {
  try {
    await recommendationsService.markRecommendationAsViewed(studentProfileId, recommendationId, token)
    return { recommendationId }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

export const markRecommendationAsCompleted = createAsyncThunk<
  { recommendationId: string },
  { studentProfileId: string; recommendationId: string; token: string }
>("aiRecommendations/markAsCompleted", async ({ studentProfileId, recommendationId, token }, { rejectWithValue }) => {
  try {
    await recommendationsService.markRecommendationAsCompleted(studentProfileId, recommendationId, token)
    return { recommendationId }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

export const saveRecommendation = createAsyncThunk<
  { recommendationId: string },
  { studentProfileId: string; recommendationId: string; token: string }
>("aiRecommendations/save", async ({ studentProfileId, recommendationId, token }, { rejectWithValue }) => {
  try {
    await recommendationsService.saveRecommendation(studentProfileId, recommendationId, token)
    return { recommendationId }
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

export const rateRecommendation = createAsyncThunk<
  { recommendationId: string; rating: number; feedback: string | null },
  { studentProfileId: string; recommendationId: string; rating: number; feedback: string | null; token: string }
>(
  "aiRecommendations/rate",
  async ({ studentProfileId, recommendationId, rating, feedback, token }, { rejectWithValue }) => {
    try {
      await recommendationsService.rateRecommendation(studentProfileId, recommendationId, rating, feedback, token)
      return { recommendationId, rating, feedback }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("An unexpected error occurred")
    }
  },
)

const aiRecommendationsSlice = createSlice({
  name: "aiRecommendations",
  initialState,
  reducers: {
    clearRecommendations: (state) => {
      state.recommendations = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = action.payload
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(generateRecommendations.pending, (state) => {
        state.isGenerating = true
        state.error = null
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.isGenerating = false
        // Merge new recommendations with existing ones, avoiding duplicates
        const existingIds = new Set(state.recommendations.map((rec) => rec.id))
        const newRecs = action.payload.filter((rec) => !existingIds.has(rec.id))
        state.recommendations = [...state.recommendations, ...newRecs]
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.isGenerating = false
        state.error = action.payload as string
      })
      .addCase(markRecommendationAsViewed.fulfilled, (state, action) => {
        const index = state.recommendations.findIndex((rec) => rec.id === action.payload.recommendationId)
        if (index !== -1) {
          state.recommendations[index].isViewed = true
          state.recommendations[index].viewedAt = new Date().toISOString()
        }
      })
      .addCase(markRecommendationAsCompleted.fulfilled, (state, action) => {
        const index = state.recommendations.findIndex((rec) => rec.id === action.payload.recommendationId)
        if (index !== -1) {
          state.recommendations[index].isCompleted = true
          state.recommendations[index].completedAt = new Date().toISOString()
        }
      })
      .addCase(saveRecommendation.fulfilled, (state, action) => {
        const index = state.recommendations.findIndex((rec) => rec.id === action.payload.recommendationId)
        if (index !== -1) {
          state.recommendations[index].isSaved = true
        }
      })
      .addCase(rateRecommendation.fulfilled, (state, action) => {
        const index = state.recommendations.findIndex((rec) => rec.id === action.payload.recommendationId)
        if (index !== -1) {
          state.recommendations[index].rating = action.payload.rating
          state.recommendations[index].feedback = action.payload.feedback
        }
      })
  },
})

export const { clearRecommendations } = aiRecommendationsSlice.actions
export default aiRecommendationsSlice.reducer
