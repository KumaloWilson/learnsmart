import { axiosInstance } from "./axios-instance"

export async function getCourseMastery(studentId: string, courseId?: string, semesterId?: string) {
  const params = new URLSearchParams()
  if (courseId) params.append("courseId", courseId)
  if (semesterId) params.append("semesterId", semesterId)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/student-portal/${studentId}/course-mastery${query}`)
  return response.data
}

export async function getCourseMasteryDetails(studentId: string, courseId: string) {
  const response = await axiosInstance.get(`/student-portal/${studentId}/course-mastery/${courseId}/details`)
  return response.data
}

export async function getTopicProgress(studentId: string, courseId: string) {
  const response = await axiosInstance.get(`/student-portal/${studentId}/topic-progress/${courseId}`)
  return response.data
}

export async function getRecommendedTopics(studentId: string, courseId: string) {
  const response = await axiosInstance.get(`/student-portal/${studentId}/recommended-topics/${courseId}`)
  return response.data
}

export async function getWeakAreas(studentId: string, courseId?: string) {
  const params = new URLSearchParams()
  if (courseId) params.append("courseId", courseId)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/student-portal/${studentId}/weak-areas${query}`)
  return response.data
}

export async function getStrengthAreas(studentId: string, courseId?: string) {
  const params = new URLSearchParams()
  if (courseId) params.append("courseId", courseId)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/student-portal/${studentId}/strength-areas${query}`)
  return response.data
}

export async function getMasteryTrends(studentId: string, courseId?: string) {
  const params = new URLSearchParams()
  if (courseId) params.append("courseId", courseId)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/student-portal/${studentId}/mastery-trends${query}`)
  return response.data
}
