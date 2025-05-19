import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UserState {
  id: string
  name: string
  email: string
  role: string
  department: string
  isAuthenticated: boolean
}

const initialState: UserState = {
  id: "L1001",
  name: "John Doe",
  email: "john.doe@smartlearn.edu",
  role: "Lecturer",
  department: "Computer Science",
  isAuthenticated: true,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload }
    },
    logout: (state) => {
      return { ...state, isAuthenticated: false }
    },
  },
})

export const { setUser, logout } = userSlice.actions
export const userReducer = userSlice.reducer
