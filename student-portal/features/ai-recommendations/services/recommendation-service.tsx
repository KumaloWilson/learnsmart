import axios from "axios"
import type { Recommendation, GenerateRecommendationsRequest } from "@/features/ai-recommendations/types"

const API_URL = "https://learnsmart-6i9q.onrender.com/api"

export const recommendationsService = {
  async getRecommendations(studentProfileId: string, token: string): Promise<Recommendation[]> {
    try {
      const response = await axios.get<Recommendation[]>(
        `${API_URL}/student-portal/${studentProfileId}/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch recommendations")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async generateRecommendations(request: GenerateRecommendationsRequest, token: string): Promise<Recommendation[]> {
    try {
      const response = await axios.post<Recommendation[]>(
        `${API_URL}/student-portal/${request.studentProfileId}/generate-recommendations`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to generate recommendations")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async markRecommendationAsViewed(studentProfileId: string, recommendationId: string, token: string): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/student-portal/${studentProfileId}/recommendation/${recommendationId}/view`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to mark recommendation as viewed")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async markRecommendationAsCompleted(
    studentProfileId: string,
    recommendationId: string,
    token: string,
  ): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/student-portal/${studentProfileId}/recommendation/${recommendationId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to mark recommendation as completed")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async saveRecommendation(studentProfileId: string, recommendationId: string, token: string): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/student-portal/${studentProfileId}/recommendation/${recommendationId}/save`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to save recommendation")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async rateRecommendation(
    studentProfileId: string,
    recommendationId: string,
    rating: number,
    feedback: string | null,
    token: string,
  ): Promise<void> {
    try {
      await axios.patch(
        `${API_URL}/student-portal/${studentProfileId}/recommendation/${recommendationId}/rate`,
        { rating, feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to rate recommendation")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
