import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/features/user/types"

interface UserState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: {
    id: "1",
    name: "John Doe",
    role: "Student",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
    },
    clearUser: (state) => {
      state.currentUser = null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
