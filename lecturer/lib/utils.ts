import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case "high":
      return "text-red-600 bg-red-50"
    case "medium":
      return "text-amber-600 bg-amber-50"
    case "low":
      return "text-green-600 bg-green-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function getEngagementLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case "very high":
      return "text-emerald-600 bg-emerald-50"
    case "high":
      return "text-green-600 bg-green-50"
    case "moderate":
      return "text-blue-600 bg-blue-50"
    case "low":
      return "text-amber-600 bg-amber-50"
    case "very low":
      return "text-red-600 bg-red-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}
