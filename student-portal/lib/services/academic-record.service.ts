import { apiService } from "./api"
import type { AcademicRecord } from "@/lib/types/academic-record.types"

export const academicRecordService = {
  /**
   * Get all academic records for a student
   */
  getAcademicRecords: async (studentId: string, token: string): Promise<AcademicRecord[]> => {
    try {
      return await apiService.request<AcademicRecord[]>(
        `/student-portal/${studentId}/academic-records`,
        "GET",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch academic records")
    }
  },
}
