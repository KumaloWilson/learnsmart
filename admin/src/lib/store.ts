import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./redux/authSlice"
import dashboardReducer from "./redux/dashboardSlice"
import schoolReducer from "./redux/schoolSlice"
import departmentReducer from "./redux/departmentSlice"
import programReducer from "./redux/programSlice"
import courseReducer from "./redux/courseSlice"
import semesterReducer from "./redux/semesterSlice"
import periodReducer from "./redux/periodSlice"
import lecturerReducer from "./redux/lecturerSlice"
import studentReducer from "./redux/studentSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    schools: schoolReducer,
    departments: departmentReducer,
    programs: programReducer,
    courses: courseReducer,
    semesters: semesterReducer,
    periods: periodReducer,
    lecturers: lecturerReducer,
    students: studentReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
