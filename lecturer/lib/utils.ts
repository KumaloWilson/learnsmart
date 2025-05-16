import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatTime(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case "high":
      return "bg-red-500 hover:bg-red-600"
    case "medium":
      return "bg-orange-500 hover:bg-orange-600"
    case "low":
      return "bg-yellow-500 hover:bg-yellow-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return ""
  if (text.length <= maxLength) return text

  return text.substring(0, maxLength) + "..."
}

export function calculateDuration(startTime: string, endTime: string): string {
  if (!startTime || !endTime) return ""

  const start = new Date(startTime)
  const end = new Date(endTime)
  const durationMs = end.getTime() - start.getTime()

  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "passed":
      return "bg-green-500 hover:bg-green-600"
    case "upcoming":
    case "in progress":
    case "pending":
      return "bg-blue-500 hover:bg-blue-600"
    case "cancelled":
    case "failed":
      return "bg-red-500 hover:bg-red-600"
    case "inactive":
    case "suspended":
      return "bg-gray-500 hover:bg-gray-600"
    default:
      return "bg-gray-500 hover:bg-gray-600"
  }
}
