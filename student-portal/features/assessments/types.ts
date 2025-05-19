export interface Assessment {
  id: string
  title: string
  courseId: string
  dueDate: string
  status: "pending" | "completed" | "overdue"
  score?: number
}
