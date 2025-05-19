import { createSlice } from "@reduxjs/toolkit"
import type { PerformanceData } from "@/features/performance/types"

interface PerformanceState {
  performanceData: PerformanceData | null
  isLoading: boolean
  error: string | null
}

const initialState: PerformanceState = {
  performanceData: null,
  isLoading: false,
  error: null,
}

const performanceSlice = createSlice({
  name: "performance",
  initialState,
  reducers: {
    // Reducers will be implemented as needed
  },
})

export default performanceSlice.reducer
