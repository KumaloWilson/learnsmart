import axios from "axios"
import type { VirtualClass, JoinVirtualClassResponse } from "@/features/virtual-classes/types"

const API_URL = "http://localhost:5000/api"

export const virtualClassesService = {
  async getVirtualClasses(studentProfileId: string, token: string): Promise<VirtualClass[]> {
    try {
      const response = await axios.get<VirtualClass[]>(
        `${API_URL}/student-portal/${studentProfileId}/virtual-classes/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch virtual classes")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async joinVirtualClass(
    studentProfileId: string,
    virtualClassId: string,
    token: string,
  ): Promise<JoinVirtualClassResponse> {
    try {
      const response = await axios.post<JoinVirtualClassResponse>(
        `${API_URL}/student-portal/${studentProfileId}/virtual-class/join`,
        {
          virtualClassId,
          studentProfileId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to join virtual class")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
