import { apiService } from "./api"
import type { AttendanceRecord } from "@/lib/types/attendance.types"

export const attendanceService = {
  /**
   * Get all attendance records for a student
   */
  getAttendanceRecords: async (studentId: string, token: string): Promise<AttendanceRecord[]> => {
    try {
      return await apiService.request<AttendanceRecord[]>(`/student-portal/${studentId}/attendance`, "GET", null, token)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch attendance records")
    }
  },
}
