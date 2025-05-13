import api from "./api"
import type { Period, CreatePeriodDto, UpdatePeriodDto } from "@/types/period"

export const periodService = {
  async getPeriods(): Promise<Period[]> {
    const response = await api.get<Period[]>("/periods")
    return response.data
  },

  async getPeriod(id: string): Promise<Period> {
    const response = await api.get<Period>(`/periods/${id}`)
    return response.data
  },

  async getPeriodsBySemester(semesterId: string): Promise<Period[]> {
    const response = await api.get<Period[]>(`/periods/semester/${semesterId}`)
    return response.data
  },

  async createPeriod(data: CreatePeriodDto): Promise<Period> {
    const response = await api.post<Period>("/periods", data)
    return response.data
  },

  async updatePeriod(id: string, data: UpdatePeriodDto): Promise<Period> {
    const response = await api.put<Period>(`/periods/${id}`, data)
    return response.data
  },

  async deletePeriod(id: string): Promise<void> {
    await api.delete(`/periods/${id}`)
  },
}

export default periodService
