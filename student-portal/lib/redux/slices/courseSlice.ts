import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { courseService } from "@/lib/services/course.service"
import type { Course } from "@/lib/types/auth.types"
import type { RootState } from "@/lib/redux/store"

interface CourseState {
  courses: Course[] | null
  isLoading: boolean
  error: string | null
}

const initialState: CourseState = {
  courses: null,
  isLoading: false,
  error: null,
}

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (accessToken: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { studentProfile } = state.auth

      if (!studentProfile) {
        return rejectWithValue("Authentication required")
      }

      // Extract courses from the student profile's current enrollments
      const courses = studentProfile.currentEnrollments.map(enrollment => {
        // Find the full course details in the program's courses array if available
        const fullCourse = studentProfile.program.courses.find(
          course => course.id === enrollment.courseId
        ) || null;

        // Return a merged course object with data from both enrollment and full course details
        return {
          id: enrollment.courseId,
          name: enrollment.courseName,
          code: enrollment.courseCode,
          creditHours: enrollment.creditHours,
          // Add additional fields from the full course if available
          ...(fullCourse && {
            description: fullCourse.description,
            level: fullCourse.level,
            programId: fullCourse.programId,
            createdAt: fullCourse.createdAt,
            updatedAt: fullCourse.updatedAt,
          }),
          // Add enrollment-specific data
          progress: {
            overall: Math.floor(Math.random() * 100) // Placeholder for actual progress data
          },
          semester: studentProfile.activeSemester,
          startDate: studentProfile.activeSemester.startDate,
          endDate: studentProfile.activeSemester.endDate,
          instructor: {
            title: "Dr.",
            firstName: "John", // Placeholder for actual instructor data
            lastName: "Doe"
          }
        };
      });

      return courses;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue("Failed to fetch courses")
    }
  }
)

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false
        state.courses = action.payload
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCourseError } = courseSlice.actions
export default courseSlice.reducer