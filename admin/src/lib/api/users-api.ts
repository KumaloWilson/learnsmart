import { axiosInstance } from "./axios-instance"

export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/users")
    return response.data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }
}

export const fetchUserById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error)
    throw new Error("Failed to fetch user")
  }
}

export const createNewUser = async (userData: any) => {
  try {
    const response = await axiosInstance.post("/users", userData)
    return response.data
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }
}

export const updateUserData = async (id: string, userData: any) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user ${id}:`, error)
    throw new Error("Failed to update user")
  }
}

export const updateUserStatusById = async (id: string, isActive: boolean) => {
  try {
    const response = await axiosInstance.patch(`/users/${id}/status`, { isActive })
    return response.data
  } catch (error) {
    console.error(`Error updating user status ${id}:`, error)
    throw new Error("Failed to update user status")
  }
}

export const deleteUserById = async (id: string) => {
  try {
    await axiosInstance.delete(`/users/${id}`)
    return true
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error)
    throw new Error("Failed to delete user")
  }
}
