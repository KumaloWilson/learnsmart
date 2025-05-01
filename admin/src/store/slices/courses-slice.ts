import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { coursesApi } from "@/lib/api"

export interface Course {
  id: string
  name: string
  code: string
  description?: string
  credits: number
  programId: string
  programName?: string
  createdAt?: string
  updatedAt?: string
}

interface CoursesState {
  courses: Course[]
  currentCourse: Course | null
  isLoading: boolean
  error: string | null
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
}

export const fetchCourses = createAsyncThunk("courses/fetchCourses", async (_, { rejectWithValue }) => {
  try {
    const response = await coursesApi.getCourses()
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch courses")
  }
})

export const fetchCourseById = createAsyncThunk("courses/fetchCourseById", async (id: string, { rejectWithValue }) => {
  try {
    const response = await coursesApi.getCourseById(id)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch course")
  }
})

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData: Omit<Course, "id">, { rejectWithValue }) => {
    try {
      const response = await coursesApi.createCourse(courseData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to create course")
    }
  },
)

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, courseData }: { id: string; courseData: Partial<Course> }, { rejectWithValue }) => {
    try {
      const response = await coursesApi.updateCourse(id, courseData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update course")
    }
  },
)

export const deleteCourse = createAsyncThunk("courses/deleteCourse", async (id: string, { rejectWithValue }) => {
  try {
    await coursesApi.deleteCourse(id)
    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to delete course")
  }
})

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCurrentCourse: (state) => {
      state.currentCourse = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.isLoading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch Course By Id
      .addCase(fetchCourseById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCourseById.fulfilled, (state, action: PayloadAction<Course>) => {
        state.isLoading = false
        state.currentCourse = action.payload
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.isLoading = false
        state.courses.push(action.payload)
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update Course
      .addCase(updateCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.isLoading = false
        const index = state.courses.findIndex((course) => course.id === action.payload.id)
        if (index !== -1) {
          state.courses[index] = action.payload
        }
        state.currentCourse = action.payload
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false
        state.courses = state.courses.filter((course) => course.id !== action.payload)
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentCourse, clearError } = coursesSlice.actions

export default coursesSlice.reducer
