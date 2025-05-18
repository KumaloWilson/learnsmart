import { apiService } from "./api"
import type { CourseData, CourseTopic } from "@/lib/types/course.types"

export const courseService = {
  /**
   * Get course details
   */
  getCourseDetails: async (
    studentId: string,
    courseId: string,
    semesterId: string,
    token: string,
  ): Promise<CourseData> => {
    try {
      return await apiService.request<CourseData>(
        `/student-portal/${studentId}/course/${courseId}/semester/${semesterId}`,
        "GET",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch course details")
    }
  },

  /**
   * Get course topics
   */
  getCourseTopics: async (
    studentId: string,
    courseId: string,
    semesterId: string,
    token: string,
  ): Promise<CourseTopic[]> => {
    try {
      return await apiService.request<CourseTopic[]>(
        `/student-portal/${studentId}/course-topics/course/${courseId}/semester/${semesterId}`,
        "GET",
        null,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch course topics")
    }
  },
}
