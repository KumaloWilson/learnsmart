import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: string
  read: boolean
}

interface NotificationsState {
  notifications: Notification[]
  loading: boolean
  error: string | null
}

const initialState: NotificationsState = {
  notifications: [
    {
      id: "n1",
      title: "Assignment Submissions",
      description: "15 new submissions for 'Database Design'",
      time: "2 hours ago",
      type: "assignment",
      read: false,
    },
    {
      id: "n2",
      title: "Department Meeting",
      description: "Reminder: Faculty meeting tomorrow at 9 AM",
      time: "5 hours ago",
      type: "meeting",
      read: false,
    },
    {
      id: "n3",
      title: "System Update",
      description: "SmartLearn will be updated this weekend",
      time: "Yesterday",
      type: "system",
      read: true,
    },
  ],
  loading: false,
  error: null,
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    fetchNotificationsStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
      state.loading = false
    },
    fetchNotificationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
  },
})

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = notificationsSlice.actions

export const notificationsReducer = notificationsSlice.reducer
