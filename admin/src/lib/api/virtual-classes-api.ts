
import type { VirtualClass } from "@/store/slices/virtual-class-slice"
import  axiosInstance from "./axios-instance"

export const virtualClassesApi = {
  getVirtualClasses: () => {
    return axiosInstance.get("/virtual-classes")
  },
  getVirtualClassesByCourse: (courseId: string) => {
    return axiosInstance.get(`/courses/${courseId}/virtual-classes`)
  },
  getVirtualClassById: (id: string) => {
    return axiosInstance.get(`/virtual-classes/${id}`)
  },
  createVirtualClass: (virtualClassData: Omit<VirtualClass, "id">) => {
    return axiosInstance.post("/virtual-classes", virtualClassData)
  },
  updateVirtualClass: (id: string, virtualClassData: Partial<VirtualClass>) => {
    return axiosInstance.put(`/virtual-classes/${id}`, virtualClassData)
  },
  deleteVirtualClass: (id: string) => {
    return axiosInstance.delete(`/virtual-classes/${id}`)
  },
  startVirtualClass: (id: string) => {
    return axiosInstance.patch(`/virtual-classes/${id}/start`)
  },
  endVirtualClass: (id: string) => {
    return axiosInstance.patch(`/virtual-classes/${id}/end`)
  },
  getVirtualClassAttendance: (id: string) => {
    return axiosInstance.get(`/virtual-classes/${id}/attendance`)
  },
}
