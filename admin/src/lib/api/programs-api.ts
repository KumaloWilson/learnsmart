
import type { Program } from "@/store/slices/programs-slice"
import { axiosInstance } from "./axios-instance"

export const programsApi = {
  getPrograms: () => {
    return axiosInstance.get("/programs")
  },
  getProgramsByDepartment: (departmentId: string) => {
    return axiosInstance.get(`/departments/${departmentId}/programs`)
  },
  getProgramById: (id: string) => {
    return axiosInstance.get(`/programs/${id}`)
  },
  createProgram: (programData: Omit<Program, "id">) => {
    return axiosInstance.post("/programs", programData)
  },
  updateProgram: (id: string, programData: Partial<Program>) => {
    return axiosInstance.put(`/programs/${id}`, programData)
  },
  deleteProgram: (id: string) => {
    return axiosInstance.delete(`/programs/${id}`)
  },
}
