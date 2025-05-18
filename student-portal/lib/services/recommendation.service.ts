import { apiService } from "./api"
import type { Recommendation, GenerateRecommendationsRequest } from "@/lib/types/recommendation.types"

export const recommendationService = {
  /**
   * Get all recommendations for a student
   */
  getRecommendations: async (studentId: string, token: string): Promise<Recommendation[]> => {
    try {
      return await apiService.request<Recommendation[]>(
        `/student-portal/${studentId}/recommendations`,
        "GET",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch recommendations")
    }
  },

  /**
   * Generate new recommendations for a student
   */
  generateRecommendations: async (
    studentId: string,
    params: GenerateRecommendationsRequest,
    token: string,
  ): Promise<Recommendation[]> => {
    try {
      return await apiService.request<Recommendation[]>(
        `/student-portal/${studentId}/generate-recommendations`,
        "POST",
        params,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to generate recommendations")
    }
  },

  /**
   * Mark a recommendation as viewed
   */
  markAsViewed: async (recommendationId: string, studentId: string, token: string): Promise<void> => {
    try {
      await apiService.request(
        `/student-portal/${studentId}/recommendations/${recommendationId}/view`,
        "PUT",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to mark recommendation as viewed")
    }
  },

  /**
   * Mark a recommendation as saved
   */
  toggleSaved: async (recommendationId: string, studentId: string, isSaved: boolean, token: string): Promise<void> => {
    try {
      await apiService.request(
        `/student-portal/${studentId}/recommendations/${recommendationId}/save`,
        "PUT",
        { isSaved },
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to update saved status")
    }
  },

  /**
   * Mark a recommendation as completed
   */
  markAsCompleted: async (
    recommendationId: string,
    studentId: string,
    isCompleted: boolean,
    token: string,
  ): Promise<void> => {
    try {
      await apiService.request(
        `/student-portal/${studentId}/recommendations/${recommendationId}/complete`,
        "PUT",
        { isCompleted },
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to update completion status")
    }
  },

  /**
   * Rate a recommendation
   */
  rateRecommendation: async (
    recommendationId: string,
    studentId: string,
    rating: number,
    feedback: string | null,
    token: string,
  ): Promise<void> => {
    try {
      await apiService.request(
        `/student-portal/${studentId}/recommendations/${recommendationId}/rate`,
        "PUT",
        { rating, feedback },
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to rate recommendation")
    }
  },
}
