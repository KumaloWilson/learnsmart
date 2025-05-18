import { apiService } from "./api"

export const assessmentService = {
  /**
   * Get all assessments for a student
   */
  getAssessments: async (studentId: string, token: string) => {
    try {
      return await apiService.request(`/student-portal/${studentId}/assessments`, "GET", null, token)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch assessments")
    }
  },

  /**
   * Get a specific assessment
   */
  getAssessment: async (studentId: string, assessmentId: string, token: string) => {
    try {
      return await apiService.request(`/student-portal/${studentId}/assessments/${assessmentId}`, "GET", null, token)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to fetch assessment")
    }
  },

  /**
   * Submit an assessment
   */
  submitAssessment: async (studentId: string, assessmentId: string, data: any, token: string) => {
    try {
      return await apiService.request(
        `/student-portal/${studentId}/assessments/${assessmentId}/submit`,
        "POST",
        data,
        token,
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Failed to submit assessment")
    }
  },
}
