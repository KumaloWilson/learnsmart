import api from "./api"
import type { Course, CreateCourseDto, UpdateCourseDto, AssignCourseToSemesterDto } from "@/types/course"

export const courseService = {
  async getCourses(): Promise<Course[]> {
    const response = await api.get<Course[]>("/courses")
    return response.data
  },

  async getCourse(id: string): Promise<Course> {
    const response = await api.get<Course>(`/courses/${id}`)
    return response.data
  },

  async getCoursesByProgram(programId: string): Promise<Course[]> {
    const response = await api.get<Course[]>(`/courses/program/${programId}`)
    return response.data
  },

  async createCourse(data: CreateCourseDto): Promise<Course> {
    const response = await api.post<Course>("/courses", data)
    return response.data
  },

  async updateCourse(id: string, data: UpdateCourseDto): Promise<Course> {
    const response = await api.put<Course>(`/courses/${id}`, data)
    return response.data
  },

  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/courses/${id}`)
  },

  async assignCourseToSemester(courseId: string, semesterId: string): Promise<void> {
    const data: AssignCourseToSemesterDto = { courseId, semesterId }
    await api.post(`/courses/${courseId}/semester/${semesterId}`, data)
  },

  async removeCourseFromSemester(courseId: string, semesterId: string): Promise<void> {
    await api.delete(`/courses/${courseId}/semester/${semesterId}`)
  },
}

export default courseService
