import { createSlice } from "@reduxjs/toolkit"
import type { VirtualClass } from "@/features/virtual-classes/types"

interface VirtualClassesState {
  virtualClasses: VirtualClass[]
  isLoading: boolean
  error: string | null
}

const initialState: VirtualClassesState = {
  virtualClasses: [],
  isLoading: false,
  error: null,
}

const virtualClassesSlice = createSlice({
  name: "virtualClasses",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default virtualClassesSlice.reducer
