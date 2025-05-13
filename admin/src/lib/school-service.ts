import api from "./api"
import type { School, CreateSchoolDto, UpdateSchoolDto } from "@/types/school"

export const schoolService = {
  async getSchools(): Promise<School[]> {
    const response = await api.get<School[]>("/schools")
    return response.data
  },

  async getSchool(id: string): Promise<School> {
    const response = await api.get<School>(`/schools/${id}`)
    return response.data
  },

  async createSchool(data: CreateSchoolDto): Promise<School> {
    const response = await api.post<School>("/schools", data)
    return response.data
  },

  async updateSchool(id: string, data: UpdateSchoolDto): Promise<School> {
    const response = await api.put<School>(`/schools/${id}`, data)
    return response.data
  },

  async deleteSchool(id: string): Promise<void> {
    await api.delete(`/schools/${id}`)
  },
}

export default schoolService
