import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import dashboardReducer from "./slices/dashboardSlice"
import courseReducer from "./slices/courseSlice"
import quizReducer from "./slices/quizSlice"
import virtualClassReducer from "./slices/virtualClassSlice"
import performanceReducer from "./slices/performanceSlice"
import attendanceReducer from "./slices/attendanceSlice"
import academicRecordReducer from "./slices/academicRecordSlice"
import quizHistoryReducer from "./slices/quizHistorySlice"
import recommendationReducer from "./slices/recommendationSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    course: courseReducer,
    quiz: quizReducer,
    virtualClass: virtualClassReducer,
    performance: performanceReducer,
    attendance: attendanceReducer,
    academicRecord: academicRecordReducer,
    quizHistory: quizHistoryReducer,
    recommendations: recommendationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
