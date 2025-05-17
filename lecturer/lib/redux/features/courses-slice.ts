import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Course {
  id: string
  name: string
  students: number
  schedule: string
  status: "Active" | "Upcoming" | "Completed"
}

interface CoursesState {
  courses: Course[]
  loading: boolean
  error: string | null
}

const initialState: CoursesState = {
  courses: [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      students: 45,
      schedule: "Mon, Wed 10:00 AM - 12:00 PM",
      status: "Active",
    },
    {
      id: "CS201",
      name: "Data Structures and Algorithms",
      students: 38,
      schedule: "Tue, Thu 2:00 PM - 4:00 PM",
      status: "Active",
    },
    {
      id: "CS301",
      name: "Database Systems",
      students: 32,
      schedule: "Mon, Fri 1:00 PM - 3:00 PM",
      status: "Active",
    },
    {
      id: "CS401",
      name: "Web Development",
      students: 28,
      schedule: "Wed, Fri 9:00 AM - 11:00 AM",
      status: "Active",
    },
  ],
  loading: false,
  error: null,
}

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchCoursesSuccess: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload
      state.loading = false
    },
    fetchCoursesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload)
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex((course) => course.id === action.payload.id)
      if (index !== -1) {
        state.courses[index] = action.payload
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter((course) => course.id !== action.payload)
    },
  },
})

export const { fetchCoursesStart, fetchCoursesSuccess, fetchCoursesFailure, addCourse, updateCourse, deleteCourse } =
  coursesSlice.actions

export const coursesReducer = coursesSlice.reducer
