import axios from "axios"
import { DashboardData } from "../types"

const API_URL = "http://localhost:5000/api"

export const dashboardService = {
  async getDashboardData(studentProfileId: string, token: string): Promise<DashboardData> {
    try {
      const response = await axios.get<DashboardData>(`${API_URL}/student-portal/${studentProfileId}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch dashboard data")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
