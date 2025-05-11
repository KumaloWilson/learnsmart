"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format, formatDistanceToNow } from "date-fns"
import { Calendar, Clock, Users, Video } from "lucide-react"

type VirtualClass = {
  id: string
  title: string
  description: string
  startTime: string
  endTime: string
  course: {
    id: string
    name: string
  }
  lecturer: {
    id: string
    name: string
  }
  meetingUrl?: string
  recordingUrl?: string
  attendees?: number
  maxAttendees?: number
  isAttending?: boolean
}

type VirtualClassesListProps = {
  virtualClasses: VirtualClass[]
  emptyMessage?: string
}

export function VirtualClassesList({
  virtualClasses,
  emptyMessage = "No virtual classes found.",
}: VirtualClassesListProps) {
  if (!virtualClasses.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Video className="mb-2 h-10 w-10 text-muted-foreground" />
        <h3 className="mb-1 text-lg font-medium">No virtual classes found</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {virtualClasses.map((virtualClass) => (
        <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} />
      ))}
    </div>
  )
}

function VirtualClassCard({ virtualClass }: { virtualClass: VirtualClass }) {
  const startTime = new Date(virtualClass.startTime)
  const endTime = new Date(virtualClass.endTime)
  const now = new Date()

  const isLive = now >= startTime && now <= endTime
  const isUpcoming = now < startTime
  const isCompleted = now > endTime

  let status = "upcoming"
  if (isLive) status = "live"
  if (isCompleted) status = "completed"

  const statusColors: Record<string, string> = {
    upcoming: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    live: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  }

  // Format the duration
  const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  const durationText =
    hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} min` : ""}` : `${minutes} min`

  // Determine action button based on status
  let actionButton
  if (isLive) {
    actionButton = (
      <Button asChild>
        <a href={virtualClass.meetingUrl} target="_blank" rel="noopener noreferrer">
          Join Now
        </a>
      </Button>
    )
  } else if (isCompleted && virtualClass.recordingUrl) {
    actionButton = (
      <Button variant="outline" asChild>
        <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
          Watch Recording
        </a>
      </Button>
    )
  } else if (isUpcoming) {
    actionButton = (
      <Button variant="outline" asChild>
        <Link href={`/virtual-classes/${virtualClass.id}`}>View Details</Link>
      </Button>
    )
  } else {
    actionButton = (
      <Button variant="outline" asChild>
        <Link href={`/virtual-classes/${virtualClass.id}`}>View Details</Link>
      </Button>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{virtualClass.title}</CardTitle>
          <Badge className={statusColors[status]}>
            {status === "live" ? "Live Now" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{virtualClass.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground mb-1">Start Time</p>
            <p className="text-sm font-medium">{format(startTime, "MMM d, yyyy")}</p>
            <p className="text-sm">{format(startTime, "h:mm a")}</p>
            {isUpcoming && (
              <p className="text-xs text-muted-foreground mt-1">
                Starts {formatDistanceToNow(startTime, { addSuffix: true })}
              </p>
            )}
          </div>

          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground mb-1">End Time</p>
            <p className="text-sm font-medium">{format(endTime, "MMM d, yyyy")}</p>
            <p className="text-sm">{format(endTime, "h:mm a")}</p>
            <p className="text-xs text-muted-foreground mt-1">Duration: {durationText}</p>
          </div>
        </div>

        {virtualClass.attendees !== undefined && virtualClass.maxAttendees && (
          <div className="mt-4">
            <p className="text-sm flex items-center">
              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
              <span>
                {virtualClass.attendees} / {virtualClass.maxAttendees} attendees
              </span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{format(startTime, "MMM d")}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            <span>{format(startTime, "h:mm a")}</span>
          </div>
        </div>
        {actionButton}
      </CardFooter>
    </Card>
  )
}
