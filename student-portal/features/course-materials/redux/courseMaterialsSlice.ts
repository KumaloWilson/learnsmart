import { createSlice } from "@reduxjs/toolkit"
import type { CourseMaterial } from "@/features/course-materials/types"

interface CourseMaterialsState {
  materials: CourseMaterial[]
  isLoading: boolean
  error: string | null
}

const initialState: CourseMaterialsState = {
  materials: [],
  isLoading: false,
  error: null,
}

const courseMaterialsSlice = createSlice({
  name: "courseMaterials",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default courseMaterialsSlice.reducer
