import axios from "axios"
import type { CourseDetails, CourseTopic } from "@/features/courses/types"

const API_URL = "https://learnsmart-6i9q.onrender.com/api"

export const coursesService = {
  async getCourseDetails(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
    token: string,
  ): Promise<CourseDetails> {
    try {
      const response = await axios.get<CourseDetails>(
        `${API_URL}/student-portal/${studentProfileId}/course/${courseId}/semester/${semesterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch course details")
      }
      throw new Error("An unexpected error occurred")
    }
  },

  async getCourseTopics(
    studentProfileId: string,
    courseId: string,
    semesterId: string,
    token: string,
  ): Promise<CourseTopic[]> {
    try {
      const response = await axios.get<CourseTopic[]>(
        `${API_URL}/student-portal/${studentProfileId}/course-topics/course/${courseId}/semester/${semesterId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to fetch course topics")
      }
      throw new Error("An unexpected error occurred")
    }
  },
}
