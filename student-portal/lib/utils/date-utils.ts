/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

/**
 * Format a time string to a readable format
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Get the time remaining until a date
 */
export function getTimeRemaining(dateString: string): string {
  const targetDate = new Date(dateString)
  const now = new Date()

  // Calculate the difference in milliseconds
  const diffMs = targetDate.getTime() - now.getTime()

  // If the date is in the past
  if (diffMs < 0) {
    return "In Progress"
  }

  // Convert to days, hours, minutes
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  // Format the output
  if (diffDays > 0) {
    return `In ${diffDays} day${diffDays > 1 ? "s" : ""}`
  } else if (diffHours > 0) {
    return `In ${diffHours} hour${diffHours > 1 ? "s" : ""}`
  } else if (diffMinutes > 0) {
    return `In ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`
  } else {
    return "Starting now"
  }
}
