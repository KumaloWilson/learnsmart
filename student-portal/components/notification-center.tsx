"use client"

import { cn } from "@/lib/utils"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"

type Notification = {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

export function NotificationCenter() {
  const { profile } = useAppSelector((state) => state.student)

  // Generate notifications based on user data
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = []

    // Add notification for each enrollment
    profile?.currentEnrollments?.forEach((enrollment) => {
      notifications.push({
        id: `enrollment-${enrollment.id}`,
        title: "Course Enrollment Confirmed",
        description: `You've been enrolled in ${enrollment.course.title}`,
        time: "Just now",
        read: false,
      })
    })

    // Add notification for new assignments
    profile?.currentEnrollments?.forEach((enrollment) => {
      enrollment.course.assignments?.forEach((assignment) => {
        notifications.push({
          id: `assignment-${assignment.id}`,
          title: "New Assignment Posted",
          description: `${enrollment.course.title}: ${assignment.title}`,
          time: "Just now",
          read: false,
        })
      })
    })

    return notifications
  }

  const [notifications, setNotifications] = useState<Notification[]>(generateNotifications())

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/70 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-default transition-colors",
                  !notification.read ? "bg-primary/5" : "",
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between w-full">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <span className="text-sm text-muted-foreground mt-1">{notification.description}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="py-6 text-center text-muted-foreground">No notifications</div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
