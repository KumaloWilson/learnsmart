import api from "./api"
import type { Semester, CreateSemesterDto, UpdateSemesterDto } from "@/types/semester"

export const semesterService = {
  async getSemesters(): Promise<Semester[]> {
    const response = await api.get<Semester[]>("/semesters")
    return response.data
  },

  async getSemester(id: string): Promise<Semester> {
    const response = await api.get<Semester>(`/semesters/${id}`)
    return response.data
  },

  async getActiveSemester(): Promise<Semester> {
    const response = await api.get<Semester>("/semesters/active")
    return response.data
  },

  async createSemester(data: CreateSemesterDto): Promise<Semester> {
    const response = await api.post<Semester>("/semesters", data)
    return response.data
  },

  async updateSemester(id: string, data: UpdateSemesterDto): Promise<Semester> {
    const response = await api.put<Semester>(`/semesters/${id}`, data)
    return response.data
  },

  async deleteSemester(id: string): Promise<void> {
    await api.delete(`/semesters/${id}`)
  },
}

export default semesterService
