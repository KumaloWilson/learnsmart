import api from "./api"
import type { Program, CreateProgramDto, UpdateProgramDto } from "@/types/program"

export const programService = {
  async getPrograms(): Promise<Program[]> {
    const response = await api.get<Program[]>("/programs")
    return response.data
  },

  async getProgram(id: string): Promise<Program> {
    const response = await api.get<Program>(`/programs/${id}`)
    return response.data
  },

  async createProgram(data: CreateProgramDto): Promise<Program> {
    const response = await api.post<Program>("/programs", data)
    return response.data
  },

  async updateProgram(id: string, data: UpdateProgramDto): Promise<Program> {
    const response = await api.put<Program>(`/programs/${id}`, data)
    return response.data
  },

  async deleteProgram(id: string): Promise<void> {
    await api.delete(`/programs/${id}`)
  },
}

export default programService
