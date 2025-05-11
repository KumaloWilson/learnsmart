import axiosInstance from "./axios-instance"

export const attendanceApi = {
  getPhysicalAttendance: (courseId: string, date?: string) => {
    const url = date ? `/courses/${courseId}/attendance?date=${date}` : `/courses/${courseId}/attendance`
    return axiosInstance.get(url)
  },
  getVirtualAttendance: (virtualClassId: string) => {
    return axiosInstance.get(`/virtual-classes/${virtualClassId}/attendance`)
  },
  markPhysicalAttendance: (
    courseId: string,
    date: string,
    attendanceData: { studentId: string; isPresent: boolean }[],
  ) => {
    return axiosInstance.post(`/courses/${courseId}/attendance`, { date, attendanceData })
  },
  updatePhysicalAttendance: (attendanceId: string, isPresent: boolean) => {
    return axiosInstance.patch(`/attendance/${attendanceId}`, { isPresent })
  },
  getStudentAttendance: (studentId: string, courseId: string) => {
    return axiosInstance.get(`/students/${studentId}/courses/${courseId}/attendance`)
  },
}
