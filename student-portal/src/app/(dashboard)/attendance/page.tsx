import type { Metadata } from "next"
import AttendancePageClient from "./attendance-page-client"

export const metadata: Metadata = {
  title: "Attendance | Learn Smart",
  description: "View your attendance records",
}

export default function AttendancePage() {
  return <AttendancePageClient />
}
