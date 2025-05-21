import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatTime(dateString: string): string {
  if (!dateString) return ""
  

  const hours = parseInt(dateString.split('T')[1].substring(0, 2), 10)
  const minutes = dateString.split('T')[1].substring(3, 5)
  
  // Format with AM/PM
  const period = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12 // Convert 0 to 12 for 12-hour format
  
  return `${formattedHours}:${minutes} ${period}`
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