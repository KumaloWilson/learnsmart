import { apiService } from "./api"
import type { VirtualClass, JoinVirtualClassRequest, JoinVirtualClassResponse } from "@/lib/types/virtual-class.types"

export const virtualClassService = {
  /**
   * Get all virtual classes for a student
   */
  getVirtualClasses: async (studentId: string, token: string): Promise<VirtualClass[]> => {
    try {
      return await apiService.request<VirtualClass[]>(
        `/student-portal/${studentId}/virtual-classes/`,
        "GET",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch virtual classes")
    }
  },

  /**
   * Join a virtual class
   */
  joinVirtualClass: async (
    studentId: string,
    request: JoinVirtualClassRequest,
    token: string,
  ): Promise<JoinVirtualClassResponse> => {
    try {
      return await apiService.request<JoinVirtualClassResponse>(
        `/student-portal/${studentId}/virtual-class/join`,
        "POST",
        request,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to join virtual class")
    }
  },
}
