import axiosInstance from "./axios-instance"
import type { Semester } from "@/store/slices/semesters-slice"

export const semestersApi = {
  getSemesters: () => {
    return axiosInstance.get("/semesters")
  },
  getActiveSemester: () => {
    return axiosInstance.get("/semesters/active")
  },
  getSemesterById: (id: string) => {
    return axiosInstance.get(`/semesters/${id}`)
  },
  createSemester: (semesterData: Omit<Semester, "id">) => {
    return axiosInstance.post("/semesters", semesterData)
  },
  updateSemester: (id: string, semesterData: Partial<Semester>) => {
    return axiosInstance.put(`/semesters/${id}`, semesterData)
  },
  deleteSemester: (id: string) => {
    return axiosInstance.delete(`/semesters/${id}`)
  },
}
