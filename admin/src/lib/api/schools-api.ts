import axiosInstance from "./axios-instance"
import type { School } from "@/store/slices/schools-slice"

export const schoolsApi = {
  getSchools: () => {
    return axiosInstance.get("/schools")
  },
  getSchoolById: (id: string) => {
    return axiosInstance.get(`/schools/${id}`)
  },
  createSchool: (schoolData: Omit<School, "id">) => {
    return axiosInstance.post("/schools", schoolData)
  },
  updateSchool: (id: string, schoolData: Partial<School>) => {
    return axiosInstance.put(`/schools/${id}`, schoolData)
  },
  deleteSchool: (id: string) => {
    return axiosInstance.delete(`/schools/${id}`)
  },
}
