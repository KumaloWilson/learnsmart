import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "@/lib/store"
import { login, logout, getProfile, updateProfile } from "@/lib/redux/authSlice"
import type { LoginCredentials, ProfileUpdateRequest } from "@/types/auth"

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth)

  const loginUser = async (credentials: LoginCredentials) => {
    return await dispatch(login(credentials)).unwrap()
  }

  const logoutUser = async () => {
    return await dispatch(logout()).unwrap()
  }

  const fetchProfile = async () => {
    return await dispatch(getProfile()).unwrap()
  }

  const updateUserProfile = async (data: ProfileUpdateRequest) => {
    return await dispatch(updateProfile(data)).unwrap()
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginUser,
    logoutUser,
    fetchProfile,
    updateUserProfile,
  }
}
