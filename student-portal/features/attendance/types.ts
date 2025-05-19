export interface AttendanceRecord {
  id: string
  courseId: string
  courseName: string
  date: string
  status: "present" | "absent" | "late"
}
