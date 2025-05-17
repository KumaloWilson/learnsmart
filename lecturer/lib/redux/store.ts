import { configureStore } from "@reduxjs/toolkit"
import { coursesReducer } from "./features/courses-slice"
import { studentsReducer } from "./features/students-slice"
import { userReducer } from "./features/user-slice"
import { notificationsReducer } from "./features/notifications-slice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: coursesReducer,
    students: studentsReducer,
    notifications: notificationsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
