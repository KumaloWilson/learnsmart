import api from "./api"
import type {
  Lecturer,
  CreateLecturerDto,
  UpdateLecturerDto,
  CourseAssignment,
  CreateCourseAssignmentDto,
  UpdateCourseAssignmentDto,
} from "@/types/lecturer"

export const lecturerService = {
  async getLecturers(): Promise<Lecturer[]> {
    const response = await api.get<Lecturer[]>("/lecturers")
    return response.data
  },

  async getLecturer(id: string): Promise<Lecturer> {
    const response = await api.get<Lecturer>(`/lecturers/${id}`)
    return response.data
  },

  async getLecturerByUserId(userId: string): Promise<Lecturer> {
    const response = await api.get<Lecturer>(`/lecturers/user/${userId}`)
    return response.data
  },

  async createLecturer(data: CreateLecturerDto): Promise<Lecturer> {
    const response = await api.post<Lecturer>("/lecturers", data)
    return response.data
  },

  async updateLecturer(id: string, data: UpdateLecturerDto): Promise<Lecturer> {
    const response = await api.put<Lecturer>(`/lecturers/${id}`, data)
    return response.data
  },

  async deleteLecturer(id: string): Promise<void> {
    await api.delete(`/lecturers/${id}`)
  },

  async getLecturerCourseAssignments(lecturerId: string): Promise<CourseAssignment[]> {
    const response = await api.get<CourseAssignment[]>(`/lecturers/${lecturerId}/course-assignments`)
    return response.data
  },

  async createCourseAssignment(data: CreateCourseAssignmentDto): Promise<CourseAssignment> {
    const response = await api.post<CourseAssignment>("/lecturers/course-assignments", data)
    return response.data
  },

  async updateCourseAssignment(id: string, data: UpdateCourseAssignmentDto): Promise<CourseAssignment> {
    const response = await api.put<CourseAssignment>(`/lecturers/course-assignments/${id}`, data)
    return response.data
  },

  async deleteCourseAssignment(id: string): Promise<void> {
    await api.delete(`/lecturers/course-assignments/${id}`)
  },
}

export default lecturerService
