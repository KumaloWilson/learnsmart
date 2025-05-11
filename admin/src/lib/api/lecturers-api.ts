import  axiosInstance  from "./axios-instance"

// Lecturer profile endpoints
export const getAllLecturers = async () => {
  const response = await axiosInstance.get("/lecturers")
  return response.data
}

export const getLecturerById = async (id: string) => {
  const response = await axiosInstance.get(`/lecturers/${id}`)
  return response.data
}

export const getLecturerByUserId = async (userId: string) => {
  const response = await axiosInstance.get(`/lecturers/user/${userId}`)
  return response.data
}

export const createLecturer = async (lecturerData: any) => {
  const response = await axiosInstance.post("/lecturers", lecturerData)
  return response.data
}

export const updateLecturer = async (id: string, lecturerData: any) => {
  const response = await axiosInstance.put(`/lecturers/${id}`, lecturerData)
  return response.data
}

export const deleteLecturer = async (id: string) => {
  const response = await axiosInstance.delete(`/lecturers/${id}`)
  return response.data
}

// Course assignment endpoints
export const getLecturerCourseAssignments = async (lecturerId: string) => {
  const response = await axiosInstance.get(`/lecturers/${lecturerId}/course-assignments`)
  return response.data
}

export const assignCourseToLecturer = async (assignmentData: any) => {
  const response = await axiosInstance.post("/lecturers/course-assignments", assignmentData)
  return response.data
}

export const updateCourseAssignment = async (id: string, assignmentData: any) => {
  const response = await axiosInstance.put(`/lecturers/course-assignments/${id}`, assignmentData)
  return response.data
}

export const removeCourseAssignment = async (id: string) => {
  const response = await axiosInstance.delete(`/lecturers/course-assignments/${id}`)
  return response.data
}

// Assessment endpoints
export const getLecturerAssessments = async (lecturerId: string) => {
  const response = await axiosInstance.get(`/lecturers/${lecturerId}/assessments`)
  return response.data
}

export const createAssessment = async (assessmentData: any) => {
  const response = await axiosInstance.post("/lecturers/assessments", assessmentData)
  return response.data
}

export const updateAssessment = async (id: string, assessmentData: any) => {
  const response = await axiosInstance.put(`/lecturers/assessments/${id}`, assessmentData)
  return response.data
}

export const deleteAssessment = async (id: string) => {
  const response = await axiosInstance.delete(`/lecturers/assessments/${id}`)
  return response.data
}

// Teaching material endpoints
export const getTeachingMaterials = async (lecturerId: string) => {
  const response = await axiosInstance.get(`/lecturers/${lecturerId}/teaching-materials`)
  return response.data
}

export const getTeachingMaterialById = async (id: string) => {
  const response = await axiosInstance.get(`/lecturers/teaching-materials/${id}`)
  return response.data
}

export const createTeachingMaterial = async (materialData: any) => {
  const response = await axiosInstance.post("/lecturers/teaching-materials", materialData)
  return response.data
}

export const updateTeachingMaterial = async (id: string, materialData: any) => {
  const response = await axiosInstance.put(`/lecturers/teaching-materials/${id}`, materialData)
  return response.data
}

export const deleteTeachingMaterial = async (id: string) => {
  const response = await axiosInstance.delete(`/lecturers/teaching-materials/${id}`)
  return response.data
}
