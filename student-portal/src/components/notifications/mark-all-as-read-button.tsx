"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { markAllNotificationsAsRead } from "@/lib/api/notifications-api"

type MarkAllAsReadButtonProps = {
  userId: string
  onSuccess?: () => void
}

export function MarkAllAsReadButton({ userId, onSuccess }: MarkAllAsReadButtonProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleMarkAllAsRead() {
    try {
      setIsLoading(true)
      await markAllNotificationsAsRead(userId)

      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Failed to mark notifications as read:", error)
      toast({
        title: "Failed to mark as read",
        description: "Could not mark notifications as read. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleMarkAllAsRead}
      disabled={isLoading}
      className="flex items-center"
    >
      <Check className="mr-2 h-4 w-4" />
      {isLoading ? "Marking..." : "Mark all as read"}
    </Button>
  )
}
