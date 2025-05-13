import api  from "./api"
import type {
  Student,
  StudentFormData,
  Enrollment,
  EnrollmentFormData,
  AcademicRecord,
  AcademicRecordFormData,
} from "@/types/student"

// Student API
export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get("/students")
  return response.data
}

export const getStudentById = async (id: string): Promise<Student> => {
  const response = await api.get(`/students/${id}`)
  return response.data
}

export const getStudentByUserId = async (userId: string): Promise<Student> => {
  const response = await api.get(`/students/user/${userId}`)
  return response.data
}

export const getStudentByStudentId = async (studentId: string): Promise<Student> => {
  const response = await api.get(`/students/student-id/${studentId}`)
  return response.data
}

export const createStudent = async (data: StudentFormData): Promise<Student> => {
  const response = await api.post("/students", data)
  return response.data
}

export const updateStudent = async (id: string, data: Partial<StudentFormData>): Promise<Student> => {
  const response = await api.put(`/students/${id}`, data)
  return response.data
}

export const deleteStudent = async (id: string): Promise<void> => {
  await api.delete(`/students/${id}`)
}

// Enrollment API
export const getStudentEnrollments = async (studentId: string): Promise<Enrollment[]> => {
  const response = await api.get(`/students/${studentId}/enrollments`)
  return response.data
}

export const getStudentEnrollmentsBySemester = async (studentId: string, semesterId: string): Promise<Enrollment[]> => {
  const response = await api.get(`/students/${studentId}/enrollments/semester/${semesterId}`)
  return response.data
}

export const enrollStudent = async (data: EnrollmentFormData): Promise<Enrollment> => {
  const response = await api.post("/students/enroll", data)
  return response.data
}

export const updateEnrollment = async (id: string, data: Partial<EnrollmentFormData>): Promise<Enrollment> => {
  const response = await api.put(`/students/enrollment/${id}`, data)
  return response.data
}

export const deleteEnrollment = async (id: string): Promise<void> => {
  await api.delete(`/students/enrollment/${id}`)
}

// Academic Record API
export const getAcademicRecordById = async (id: string): Promise<AcademicRecord> => {
  const response = await api.get(`/students/academic-record/${id}`)
  return response.data
}

export const getStudentAcademicRecords = async (studentId: string): Promise<AcademicRecord[]> => {
  const response = await api.get(`/students/${studentId}/academic-records`)
  return response.data
}

export const createAcademicRecord = async (data: AcademicRecordFormData): Promise<AcademicRecord> => {
  const response = await api.post("/students/academic-record", data)
  return response.data
}

export const updateAcademicRecord = async (
  id: string,
  data: Partial<AcademicRecordFormData>,
): Promise<AcademicRecord> => {
  const response = await api.put(`/students/academic-record/${id}`, data)
  return response.data
}

export const deleteAcademicRecord = async (id: string): Promise<void> => {
  await api.delete(`/students/academic-record/${id}`)
}
