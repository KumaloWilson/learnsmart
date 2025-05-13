import api from "./api"
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "@/types/department"

export const departmentService = {
  async getDepartments(): Promise<Department[]> {
    const response = await api.get<Department[]>("/departments")
    return response.data
  },

  async getDepartment(id: string): Promise<Department> {
    const response = await api.get<Department>(`/departments/${id}`)
    return response.data
  },

  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    const response = await api.post<Department>("/departments", data)
    return response.data
  },

  async updateDepartment(id: string, data: UpdateDepartmentDto): Promise<Department> {
    const response = await api.put<Department>(`/departments/${id}`, data)
    return response.data
  },

  async deleteDepartment(id: string): Promise<void> {
    await api.delete(`/departments/${id}`)
  },
}

export default departmentService
