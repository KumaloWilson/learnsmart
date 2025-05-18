import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { recommendationService } from "@/lib/services/recommendation.service"
import type { GenerateRecommendationsRequest, RecommendationsState } from "@/lib/types/recommendation.types"
import type { RootState } from "@/lib/redux/store"

const initialState: RecommendationsState = {
  recommendations: [],
  isLoading: false,
  error: null,
  generatingRecommendations: false,
  generationError: null,
  filters: {
    resourceType: null,
    difficulty: null,
    courseId: null,
    searchQuery: "",
  },
}

export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchRecommendations",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const recommendations = await recommendationService.getRecommendations(studentProfile.id, accessToken)
      return recommendations
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch recommendations")
    }
  },
)

export const generateRecommendations = createAsyncThunk(
  "recommendations/generateRecommendations",
  async (params: Partial<GenerateRecommendationsRequest>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      const requestParams: GenerateRecommendationsRequest = {
        studentProfileId: studentProfile.id,
        ...params,
      }

      const recommendations = await recommendationService.generateRecommendations(
        studentProfile.id,
        requestParams,
        accessToken,
      )
      return recommendations
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to generate recommendations")
    }
  },
)

export const markRecommendationAsViewed = createAsyncThunk(
  "recommendations/markAsViewed",
  async (recommendationId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      await recommendationService.markAsViewed(recommendationId, studentProfile.id, accessToken)
      return { recommendationId }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to mark recommendation as viewed")
    }
  },
)

export const toggleRecommendationSaved = createAsyncThunk(
  "recommendations/toggleSaved",
  async (
    { recommendationId, isSaved }: { recommendationId: string; isSaved: boolean },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      await recommendationService.toggleSaved(recommendationId, studentProfile.id, isSaved, accessToken)
      return { recommendationId, isSaved }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to update saved status")
    }
  },
)

export const markRecommendationAsCompleted = createAsyncThunk(
  "recommendations/markAsCompleted",
  async (
    { recommendationId, isCompleted }: { recommendationId: string; isCompleted: boolean },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      await recommendationService.markAsCompleted(recommendationId, studentProfile.id, isCompleted, accessToken)
      return { recommendationId, isCompleted }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to update completion status")
    }
  },
)

export const rateRecommendation = createAsyncThunk(
  "recommendations/rateRecommendation",
  async (
    { recommendationId, rating, feedback }: { recommendationId: string; rating: number; feedback: string | null },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState
      const { studentProfile, accessToken } = state.auth

      if (!studentProfile || !accessToken) {
        return rejectWithValue("Authentication required")
      }

      await recommendationService.rateRecommendation(recommendationId, studentProfile.id, rating, feedback, accessToken)
      return { recommendationId, rating, feedback }
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to rate recommendation")
    }
  },
)

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {
    setResourceTypeFilter: (state, action) => {
      state.filters.resourceType = action.payload
    },
    setDifficultyFilter: (state, action) => {
      state.filters.difficulty = action.payload
    },
    setCourseFilter: (state, action) => {
      state.filters.courseId = action.payload
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.filters = {
        resourceType: null,
        difficulty: null,
        courseId: null,
        searchQuery: "",
      }
    },
    clearRecommendationErrors: (state) => {
      state.error = null
      state.generationError = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch recommendations
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
      // Generate recommendations
      .addCase(generateRecommendations.pending, (state) => {
        state.generatingRecommendations = true
        state.generationError = null
      })
      .addCase(generateRecommendations.fulfilled, (state, action) => {
        state.generatingRecommendations = false
        state.recommendations = action.payload
      })
      .addCase(generateRecommendations.rejected, (state, action) => {
        state.generatingRecommendations = false
        state.generationError = action.payload as string
      })
      // Mark as viewed
      .addCase(markRecommendationAsViewed.fulfilled, (state, action) => {
        const { recommendationId } = action.payload
        const recommendation = state.recommendations.find((rec) => rec.id === recommendationId)
        if (recommendation) {
          recommendation.isViewed = true
          recommendation.viewedAt = new Date().toISOString()
        }
      })
      // Toggle saved
      .addCase(toggleRecommendationSaved.fulfilled, (state, action) => {
        const { recommendationId, isSaved } = action.payload
        const recommendation = state.recommendations.find((rec) => rec.id === recommendationId)
        if (recommendation) {
          recommendation.isSaved = isSaved
        }
      })
      // Mark as completed
      .addCase(markRecommendationAsCompleted.fulfilled, (state, action) => {
        const { recommendationId, isCompleted } = action.payload
        const recommendation = state.recommendations.find((rec) => rec.id === recommendationId)
        if (recommendation) {
          recommendation.isCompleted = isCompleted
          recommendation.completedAt = isCompleted ? new Date().toISOString() : null
        }
      })
      // Rate recommendation
      .addCase(rateRecommendation.fulfilled, (state, action) => {
        const { recommendationId, rating, feedback } = action.payload
        const recommendation = state.recommendations.find((rec) => rec.id === recommendationId)
        if (recommendation) {
          recommendation.rating = rating
          recommendation.feedback = feedback
        }
      })
  },
})

export const {
  setResourceTypeFilter,
  setDifficultyFilter,
  setCourseFilter,
  setSearchQuery,
  clearFilters,
  clearRecommendationErrors,
} = recommendationSlice.actions

export const selectFilteredRecommendations = (state: RootState) => {
  const { recommendations, filters } = state.recommendations

  return recommendations.filter((rec) => {
    // Filter by resource type
    if (filters.resourceType && rec.learningResource.type !== filters.resourceType) {
      return false
    }

    // Filter by difficulty
    if (filters.difficulty !== null && rec.learningResource.difficulty !== filters.difficulty) {
      return false
    }

    // Filter by course
    if (filters.courseId && rec.courseId !== filters.courseId) {
      return false
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      return (
        rec.learningResource.title.toLowerCase().includes(query) ||
        rec.learningResource.description.toLowerCase().includes(query) ||
        rec.course.name.toLowerCase().includes(query) ||
        rec.learningResource.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return true
  })
}

export default recommendationSlice.reducer
