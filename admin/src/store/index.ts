import { configureStore } from "@reduxjs/toolkit"
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import authReducer from "./slices/auth-slice"
import schoolsReducer from "./slices/schools-slice"
import departmentsReducer from "./slices/departments-slice"
import programsReducer from "./slices/programs-slice"
import coursesReducer from "./slices/courses-slice"
import usersReducer from "./slices/users-slice"
import semestersReducer from "./slices/semesters-slice"
import dashboardReducer from "./slices/dashboard-slice"
import quizzesReducer from "./slices/quiz-slice"
import virtualClassesReducer from "./slices/virtual-class-slice"
import attendanceReducer from "./slices/attendance-slice"
import studentPerformanceReducer from "./slices/student-performance-slice"
import studentsReducer from "./slices/students-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schools: schoolsReducer,
    departments: departmentsReducer,
    programs: programsReducer,
    courses: coursesReducer,
    users: usersReducer,
    semesters: semestersReducer,
    dashboard: dashboardReducer,
    quizzes: quizzesReducer,
    virtualClasses: virtualClassesReducer,
    attendance: attendanceReducer,
    studentPerformance: studentPerformanceReducer,
    students: studentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
