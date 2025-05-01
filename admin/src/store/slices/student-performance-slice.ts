import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { studentPerformanceApi } from "@/lib/api/student-performance-api"

export interface StudentPerformance {
  id: string
  studentId: string
  studentName?: string
  courseId: string
  courseName?: string
  overallScore: number
  quizAverage: number
  assignmentAverage: number
  attendancePercentage: number
  lastActivity?: string
  createdAt?: string
  updatedAt?: string
}

export interface StudentCourseProgress {
  courseId: string
  courseName: string
  progress: number
  topicsCompleted: number
  totalTopics: number
}

interface StudentPerformanceState {
  performances: StudentPerformance[]
  courseProgress: StudentCourseProgress[]
  isLoading: boolean
  error: string | null
}

const initialState: StudentPerformanceState = {
  performances: [],
  courseProgress: [],
  isLoading: false,
  error: null,
}

export const fetchStudentPerformances = createAsyncThunk(
  "studentPerformance/fetchStudentPerformances",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getStudentPerformances(courseId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch student performances")
    }
  },
)

export const fetchStudentPerformanceById = createAsyncThunk(
  "studentPerformance/fetchStudentPerformanceById",
  async ({ courseId, studentId }: { courseId: string; studentId: string }, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getStudentPerformanceById(courseId, studentId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch student performance")
    }
  },
)

export const fetchStudentCourseProgress = createAsyncThunk(
  "studentPerformance/fetchStudentCourseProgress",
  async (studentId: string, { rejectWithValue }) => {
    try {
      const response = await studentPerformanceApi.getStudentCourseProgress(studentId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch student course progress")
    }
  },
)

const studentPerformanceSlice = createSlice({
  name: "studentPerformance",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Student Performances
      .addCase(fetchStudentPerformances.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentPerformances.fulfilled, (state, action: PayloadAction<StudentPerformance[]>) => {
        state.isLoading = false
        state.performances = action.payload
      })
      .addCase(fetchStudentPerformances.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Student Performance By Id
      .addCase(fetchStudentPerformanceById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentPerformanceById.fulfilled, (state, action: PayloadAction<StudentPerformance>) => {
        state.isLoading = false
        const index = state.performances.findIndex(
          (performance) =>
            performance.studentId === action.payload.studentId && performance.courseId === action.payload.courseId,
        )
        if (index !== -1) {
          state.performances[index] = action.payload
        } else {
          state.performances.push(action.payload)
        }
      })
      .addCase(fetchStudentPerformanceById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Student Course Progress
      .addCase(fetchStudentCourseProgress.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentCourseProgress.fulfilled, (state, action: PayloadAction<StudentCourseProgress[]>) => {
        state.isLoading = false
        state.courseProgress = action.payload
      })
      .addCase(fetchStudentCourseProgress.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = studentPerformanceSlice.actions

export default studentPerformanceSlice.reducer
