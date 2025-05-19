import axios from "axios"
import type { AttendanceRecord } from "@/features/attendance/types"

const API_URL = "http://localhost:5000/api"

export const attendanceService = {
  async getAttendanceRecords(studentProfileId: string, token: string): Promise<AttendanceRecord[]> {
    try {
      const response = await axios.get<AttendanceRecord[]>(`${API_URL}/student-portal/${studentProfileId}/attendance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch attendance records")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
