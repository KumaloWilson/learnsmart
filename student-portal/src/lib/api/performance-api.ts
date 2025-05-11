import { axiosInstance } from "./axios-instance"

export async function getPerformance(
  studentId: string,
  filters?: {
    courseId?: string
    semesterId?: string
    assessmentType?: string
  },
) {
  const params = new URLSearchParams()
  if (filters) {
    if (filters.courseId) params.append("courseId", filters.courseId)
    if (filters.semesterId) params.append("semesterId", filters.semesterId)
    if (filters.assessmentType) params.append("assessmentType", filters.assessmentType)
  }

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/student-portal/${studentId}/performance${query}`)
  return response.data
}

export async function getPerformanceOverview(studentId: string, semesterId?: string) {
  const params = new URLSearchParams()
  if (semesterId) params.append("semesterId", semesterId)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/student-portal/${studentId}/performance-overview${query}`)
  return response.data
}

export async function getPerformanceTrends(studentId: string, courseId?: string) {
  const params = new URLSearchParams()
  if (courseId) params.append("courseId", courseId)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/student-portal/${studentId}/performance-trends${query}`)
  return response.data
}

export async function getGradeDistribution(courseId: string, assessmentId?: string) {
  const params = new URLSearchParams()
  if (assessmentId) params.append("assessmentId", assessmentId)

  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await axiosInstance.get(`/courses/${courseId}/grade-distribution${query}`)
  return response.data
}

export async function getAcademicRecords(studentId: string) {
  const response = await axiosInstance.get(`/student-portal/${studentId}/academic-records`)
  return response.data
}

export async function getGPA(studentId: string) {
  const response = await axiosInstance.get(`/student-portal/${studentId}/gpa`)
  return response.data
}
