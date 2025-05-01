import { axiosInstance } from "./axios-instance"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export const usersApi = {
  getUsers: async () => {
    try {
      const response = await axiosInstance.get("/users")
      return response
    } catch (error: any) {
      console.error("Error fetching users:", error)
      throw error
    }
  },

  getUserById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/users/${id}`)
      return response
    } catch (error: any) {
      console.error(`Error fetching user ${id}:`, error)
      throw error
    }
  },

  createUser: async (userData: Omit<User, "id">) => {
    try {
      const response = await axiosInstance.post("/users", userData)
      return response
    } catch (error: any) {
      console.error("Error creating user:", error)
      throw error
    }
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    try {
      const response = await axiosInstance.put(`/users/${id}`, userData)
      return response
    } catch (error: any) {
      console.error(`Error updating user ${id}:`, error)
      throw error
    }
  },

  updateUserStatus: async (id: string, isActive: boolean) => {
    try {
      const response = await axiosInstance.patch(`/users/${id}/status`, { isActive })
      return response
    } catch (error: any) {
      console.error(`Error updating user status ${id}:`, error)
      throw error
    }
  },

  deleteUser: async (id: string) => {
    try {
      await axiosInstance.delete(`/users/${id}`)
      return { success: true }
    } catch (error: any) {
      console.error(`Error deleting user ${id}:`, error)
      throw error
    }
  }
}