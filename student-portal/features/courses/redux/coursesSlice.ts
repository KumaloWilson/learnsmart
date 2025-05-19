import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { CourseDetails, CourseTopic } from "@/features/courses/types"
import { coursesService } from "../services/course-service"

interface CoursesState {
  currentCourseDetails: CourseDetails | null
  currentCourseTopics: CourseTopic[]
  isLoadingDetails: boolean
  isLoadingTopics: boolean
  error: string | null
}

const initialState: CoursesState = {
  currentCourseDetails: null,
  currentCourseTopics: [],
  isLoadingDetails: false,
  isLoadingTopics: false,
  error: null,
}

export const fetchCourseDetails = createAsyncThunk<
  CourseDetails,
  { studentProfileId: string; courseId: string; semesterId: string; token: string }
>("courses/fetchDetails", async ({ studentProfileId, courseId, semesterId, token }, { rejectWithValue }) => {
  try {
    const data = await coursesService.getCourseDetails(studentProfileId, courseId, semesterId, token)
    return data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

export const fetchCourseTopics = createAsyncThunk<
  CourseTopic[],
  { studentProfileId: string; courseId: string; semesterId: string; token: string }
>("courses/fetchTopics", async ({ studentProfileId, courseId, semesterId, token }, { rejectWithValue }) => {
  try {
    const data = await coursesService.getCourseTopics(studentProfileId, courseId, semesterId, token)
    return data
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue("An unexpected error occurred")
  }
})

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseDetails: (state) => {
      state.currentCourseDetails = null
      state.currentCourseTopics = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseDetails.pending, (state) => {
        state.isLoadingDetails = true
        state.error = null
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false
        state.currentCourseDetails = action.payload
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.isLoadingDetails = false
        state.error = action.payload as string
      })
      .addCase(fetchCourseTopics.pending, (state) => {
        state.isLoadingTopics = true
        state.error = null
      })
      .addCase(fetchCourseTopics.fulfilled, (state, action) => {
        state.isLoadingTopics = false
        state.currentCourseTopics = action.payload
      })
      .addCase(fetchCourseTopics.rejected, (state, action) => {
        state.isLoadingTopics = false
        state.error = action.payload as string
      })
  },
})

export const { clearCourseDetails } = coursesSlice.actions
export default coursesSlice.reducer
