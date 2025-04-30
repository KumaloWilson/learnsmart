import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  } catch (error) {
    return "Invalid date"
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, "h:mm a")
  } catch (error) {
    return "Invalid time"
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy 'at' h:mm a")
  } catch (error) {
    return "Invalid date/time"
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getInitials(name: string): string {
  if (!name) return ""
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "approved":
    case "success":
      return "bg-green-500"
    case "pending":
    case "in progress":
    case "in_progress":
    case "waiting":
      return "bg-yellow-500"
    case "failed":
    case "rejected":
    case "cancelled":
    case "error":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}
