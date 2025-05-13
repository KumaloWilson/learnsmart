import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Course, CreateCourseDto, UpdateCourseDto } from "@/types/course"
import courseService from "@/lib/course-service"

interface CourseState {
  courses: Course[]
  programCourses: Course[]
  currentCourse: Course | null
  isLoading: {
    courses: boolean
    programCourses: boolean
    currentCourse: boolean
    create: boolean
    update: boolean
    delete: boolean
    assignToSemester: boolean
    removeFromSemester: boolean
  }
  error: string | null
}

const initialState: CourseState = {
  courses: [],
  programCourses: [],
  currentCourse: null,
  isLoading: {
    courses: false,
    programCourses: false,
    currentCourse: false,
    create: false,
    update: false,
    delete: false,
    assignToSemester: false,
    removeFromSemester: false,
  },
  error: null,
}

export const fetchCourses = createAsyncThunk("courses/fetchCourses", async (_, { rejectWithValue }) => {
  try {
    return await courseService.getCourses()
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch courses")
  }
})

export const fetchCourse = createAsyncThunk("courses/fetchCourse", async (id: string, { rejectWithValue }) => {
  try {
    return await courseService.getCourse(id)
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to fetch course")
  }
})

export const fetchCoursesByProgram = createAsyncThunk(
  "courses/fetchCoursesByProgram",
  async (programId: string, { rejectWithValue }) => {
    try {
      return await courseService.getCoursesByProgram(programId)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to fetch courses by program")
    }
  },
)

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (data: CreateCourseDto, { rejectWithValue }) => {
    try {
      return await courseService.createCourse(data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to create course")
    }
  },
)

export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ id, data }: { id: string; data: UpdateCourseDto }, { rejectWithValue }) => {
    try {
      return await courseService.updateCourse(id, data)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to update course")
    }
  },
)

export const deleteCourse = createAsyncThunk("courses/deleteCourse", async (id: string, { rejectWithValue }) => {
  try {
    await courseService.deleteCourse(id)
    return id
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } } }
    return rejectWithValue(err.response?.data?.message || "Failed to delete course")
  }
})

export const assignCourseToSemester = createAsyncThunk(
  "courses/assignCourseToSemester",
  async ({ courseId, semesterId }: { courseId: string; semesterId: string }, { rejectWithValue }) => {
    try {
      await courseService.assignCourseToSemester(courseId, semesterId)
      return { courseId, semesterId }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to assign course to semester")
    }
  },
)

export const removeCourseFromSemester = createAsyncThunk(
  "courses/removeCourseFromSemester",
  async ({ courseId, semesterId }: { courseId: string; semesterId: string }, { rejectWithValue }) => {
    try {
      await courseService.removeCourseFromSemester(courseId, semesterId)
      return { courseId, semesterId }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      return rejectWithValue(err.response?.data?.message || "Failed to remove course from semester")
    }
  },
)

const courseSlice = createSlice({
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
        state.isLoading.courses = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading.courses = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading.courses = false
        state.error = action.payload as string
      })

      // Fetch Course
      .addCase(fetchCourse.pending, (state) => {
        state.isLoading.currentCourse = true
        state.error = null
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.isLoading.currentCourse = false
        state.currentCourse = action.payload
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading.currentCourse = false
        state.error = action.payload as string
      })

      // Fetch Courses By Program
      .addCase(fetchCoursesByProgram.pending, (state) => {
        state.isLoading.programCourses = true
        state.error = null
      })
      .addCase(fetchCoursesByProgram.fulfilled, (state, action) => {
        state.isLoading.programCourses = false
        state.programCourses = action.payload
      })
      .addCase(fetchCoursesByProgram.rejected, (state, action) => {
        state.isLoading.programCourses = false
        state.error = action.payload as string
      })

      // Create Course
      .addCase(createCourse.pending, (state) => {
        state.isLoading.create = true
        state.error = null
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading.create = false
        state.courses.push(action.payload)
        if (action.payload.programId) {
          state.programCourses.push(action.payload)
        }
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading.create = false
        state.error = action.payload as string
      })

      // Update Course
      .addCase(updateCourse.pending, (state) => {
        state.isLoading.update = true
        state.error = null
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.isLoading.update = false
        const index = state.courses.findIndex((course) => course.id === action.payload.id)
        if (index !== -1) {
          state.courses[index] = action.payload
        }
        const programIndex = state.programCourses.findIndex((course) => course.id === action.payload.id)
        if (programIndex !== -1) {
          state.programCourses[programIndex] = action.payload
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.isLoading.update = false
        state.error = action.payload as string
      })

      // Delete Course
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading.delete = true
        state.error = null
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading.delete = false
        state.courses = state.courses.filter((course) => course.id !== action.payload)
        state.programCourses = state.programCourses.filter((course) => course.id !== action.payload)
        if (state.currentCourse?.id === action.payload) {
          state.currentCourse = null
        }
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading.delete = false
        state.error = action.payload as string
      })

      // Assign Course to Semester
      .addCase(assignCourseToSemester.pending, (state) => {
        state.isLoading.assignToSemester = true
        state.error = null
      })
      .addCase(assignCourseToSemester.fulfilled, (state) => {
        state.isLoading.assignToSemester = false
      })
      .addCase(assignCourseToSemester.rejected, (state, action) => {
        state.isLoading.assignToSemester = false
        state.error = action.payload as string
      })

      // Remove Course from Semester
      .addCase(removeCourseFromSemester.pending, (state) => {
        state.isLoading.removeFromSemester = true
        state.error = null
      })
      .addCase(removeCourseFromSemester.fulfilled, (state) => {
        state.isLoading.removeFromSemester = false
      })
      .addCase(removeCourseFromSemester.rejected, (state, action) => {
        state.isLoading.removeFromSemester = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentCourse, clearError } = courseSlice.actions
export default courseSlice.reducer
