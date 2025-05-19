import { createSlice } from "@reduxjs/toolkit"
import type { Recommendation } from "@/features/ai-recommendations/types"

interface AIRecommendationsState {
  recommendations: Recommendation[]
  isLoading: boolean
  error: string | null
}

const initialState: AIRecommendationsState = {
  recommendations: [],
  isLoading: false,
  error: null,
}

const aiRecommendationsSlice = createSlice({
  name: "aiRecommendations",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default aiRecommendationsSlice.reducer
