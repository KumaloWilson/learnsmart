import { apiService } from "./api"
import type { DashboardData } from "@/lib/types/dashboard.types"

export const studentService = {
  /**
   * Get student dashboard data
   */
  getDashboard: async (studentId: string, token: string): Promise<DashboardData> => {
    try {
      return await apiService.request<DashboardData>(`/student-portal/${studentId}/dashboard`, "GET", null, token)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch dashboard data: ${error.message}`)
      }
      throw new Error("Failed to fetch dashboard data")
    }
  },
}
