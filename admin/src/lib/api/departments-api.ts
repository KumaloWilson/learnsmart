
import type { Department } from "@/store/slices/departments-slice"
import { axiosInstance } from "./axios-instance"

export const departmentsApi = {
  getDepartments: () => {
    return axiosInstance.get("/departments")
  },
  getDepartmentsBySchool: (schoolId: string) => {
    return axiosInstance.get(`/schools/${schoolId}/departments`)
  },
  getDepartmentById: (id: string) => {
    return axiosInstance.get(`/departments/${id}`)
  },
  createDepartment: (departmentData: Omit<Department, "id">) => {
    return axiosInstance.post("/departments", departmentData)
  },
  updateDepartment: (id: string, departmentData: Partial<Department>) => {
    return axiosInstance.put(`/departments/${id}`, departmentData)
  },
  deleteDepartment: (id: string) => {
    return axiosInstance.delete(`/departments/${id}`)
  },
}
