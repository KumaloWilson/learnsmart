"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, Info, AlertTriangle, Calendar, FileText, GraduationCap } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { markNotificationAsRead } from "@/lib/api/notifications-api"

type Notification = {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
  link?: string
  courseId?: string
  courseName?: string
}

type NotificationsListProps = {
  notifications: Notification[]
  onNotificationRead?: (notificationId: string) => void
  emptyMessage?: string
}

export function NotificationsList({
  notifications,
  onNotificationRead,
  emptyMessage = "No notifications found.",
}: NotificationsListProps) {
  const { toast } = useToast()
  const [loadingIds, setLoadingIds] = useState<string[]>([])

  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No notifications</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  async function handleMarkAsRead(notificationId: string) {
    try {
      setLoadingIds((prev) => [...prev, notificationId])
      await markNotificationAsRead(notificationId)

      if (onNotificationRead) {
        onNotificationRead(notificationId)
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      toast({
        title: "Failed to mark as read",
        description: "Could not mark notification as read. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingIds((prev) => prev.filter((id) => id !== notificationId))
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "announcement":
        return <Info className="h-5 w-5 text-blue-500" />
      case "assessment":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "grade":
        return <GraduationCap className="h-5 w-5 text-green-500" />
      case "virtual_class":
        return <Calendar className="h-5 w-5 text-indigo-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={notification.isRead ? "bg-muted/50" : ""}>
          <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
            <div className="flex items-center space-x-2">
              {getNotificationIcon(notification.type)}
              <CardTitle className="text-base">{notification.title}</CardTitle>
            </div>
            {!notification.isRead && (
              <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                New
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm">{notification.message}</p>
            {notification.courseName && (
              <CardDescription className="mt-2">Course: {notification.courseName}</CardDescription>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
            <div className="flex space-x-2">
              {notification.link && (
                <Button variant="outline" size="sm" asChild>
                  <a href={notification.link}>View</a>
                </Button>
              )}
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={loadingIds.includes(notification.id)}
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  {loadingIds.includes(notification.id) ? "Marking..." : "Mark as read"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
