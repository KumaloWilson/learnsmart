import { apiService } from "./api"
import type { CoursePerformance } from "@/lib/types/performance.types"

export const performanceService = {
  /**
   * Get detailed performance for a specific course and semester
   */
  getCoursePerformance: async (
    studentId: string,
    courseId: string,
    semesterId: string,
    token: string,
  ): Promise<CoursePerformance[]> => {
    try {
      return await apiService.request<CoursePerformance[]>(
        `/student-portal/${studentId}/performance/course/${courseId}/semester/${semesterId}`,
        "GET",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch course performance data")
    }
  },
}
