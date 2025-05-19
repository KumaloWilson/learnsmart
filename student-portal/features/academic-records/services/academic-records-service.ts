import axios from "axios"
import type { AcademicRecord } from "@/features/academic-records/types"

const API_URL = "https://learnsmart-6i9q.onrender.com/api"

export const academicRecordsService = {
  async getAcademicRecords(studentProfileId: string, token: string): Promise<AcademicRecord[]> {
    try {
      const response = await axios.get<AcademicRecord[]>(
        `${API_URL}/student-portal/${studentProfileId}/academic-records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch academic records")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
