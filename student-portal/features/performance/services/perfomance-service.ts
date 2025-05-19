import axios from "axios"
import type { PerformanceData } from "@/features/performance/types"

const API_URL = "http://localhost:5000/api"

export const performanceService = {
  async getPerformanceData(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
    token: string,
  ): Promise<PerformanceData[]> {
    try {
      const response = await axios.get<PerformanceData[]>(
        `${API_URL}/student-portal/${studentProfileId}/performance/course/${courseId}/semester/${semesterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch performance data")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
