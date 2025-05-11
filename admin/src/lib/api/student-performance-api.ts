import axiosInstance from './axios-instance'

export const studentPerformanceApi = {
  getStudentPerformances: (courseId: string) => {
    return axiosInstance.get(`/courses/${courseId}/student-performances`)
  },
  getStudentPerformanceById: (courseId: string, studentId: string) => {
    return axiosInstance.get(`/courses/${courseId}/students/${studentId}/performance`)
  },
  getStudentCourseProgress: (studentId: string) => {
    return axiosInstance.get(`/students/${studentId}/course-progress`)
  },
  getAtRiskStudents: (courseId: string) => {
    return axiosInstance.get(`/courses/${courseId}/at-risk-students`)
  },
  getStudentQuizAttempts: (studentId: string, courseId: string) => {
    return axiosInstance.get(`/students/${studentId}/courses/${courseId}/quiz-attempts`)
  },
  getStudentAssessmentSubmissions: (studentId: string, courseId: string) => {
    return axiosInstance.get(`/students/${studentId}/courses/${courseId}/assessment-submissions`)
  },
}
