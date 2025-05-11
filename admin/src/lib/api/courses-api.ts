
import type { Course } from "@/store/slices/courses-slice"
import axiosInstance  from "./axios-instance"

export const coursesApi = {
  getCourses: () => {
    return axiosInstance.get("/courses")
  },
  getCoursesByProgram: (programId: string) => {
    return axiosInstance.get(`/programs/${programId}/courses`)
  },
  getCourseById: (id: string) => {
    return axiosInstance.get(`/courses/${id}`)
  },
  createCourse: (courseData: Omit<Course, "id">) => {
    return axiosInstance.post("/courses", courseData)
  },
  updateCourse: (id: string, courseData: Partial<Course>) => {
    return axiosInstance.put(`/courses/${id}`, courseData)
  },
  deleteCourse: (id: string) => {
    return axiosInstance.delete(`/courses/${id}`)
  },
}
