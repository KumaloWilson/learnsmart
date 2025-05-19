import { createSlice } from "@reduxjs/toolkit"
import type { Course } from "@/features/courses/types"

interface CoursesState {
  courses: Course[]
  isLoading: boolean
  error: string | null
}

const initialState: CoursesState = {
  courses: [],
  isLoading: false,
  error: null,
}

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default coursesSlice.reducer
