"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Video, Users, Clock } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils/date-utils"
import type { VirtualClass } from "@/lib/types/virtual-class.types"

interface VirtualClassCardProps {
  virtualClass: VirtualClass
  onJoin: (virtualClass: VirtualClass) => void
  status: "upcoming" | "ongoing" | "past"
}

export function VirtualClassCard({ virtualClass, onJoin, status }: VirtualClassCardProps) {
  const isOngoing = status === "ongoing"
  const isPast = status === "past"

  // Calculate duration in hours
  const durationHours = Math.round(
    (new Date(virtualClass.scheduledEndTime).getTime() - new Date(virtualClass.scheduledStartTime).getTime()) /
      (1000 * 60 * 60),
  )

  return (
    <Card
      className={`overflow-hidden ${isOngoing ? "border-green-200 dark:border-green-800" : ""} ${isPast ? "opacity-80" : ""}`}
    >
      <CardHeader
        className={`${isOngoing ? "bg-green-50 dark:bg-green-900/20" : isPast ? "bg-muted" : "bg-primary/5"} pb-4`}
      >
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{virtualClass.title}</CardTitle>
            <CardDescription className="mt-1">
              {virtualClass.course.name} ({virtualClass.course.code})
            </CardDescription>
          </div>
          <Badge
            className={isOngoing ? "bg-green-100 text-green-800 hover:bg-green-200 border-none" : ""}
            variant={!isOngoing ? "outline" : "default"}
          >
            {isOngoing ? "In Progress" : isPast ? "Completed" : "Upcoming"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {formatDate(virtualClass.scheduledStartTime)} • {formatTime(virtualClass.scheduledStartTime)} -{" "}
                {formatTime(virtualClass.scheduledEndTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
                {virtualClass.lecturerProfile.user.lastName}
              </span>
            </div>
            {!isPast && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Duration: {durationHours} hour{durationHours !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground">{virtualClass.description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {isPast ? (
          virtualClass.isRecorded && virtualClass.recordingUrl ? (
            <Button variant="outline" asChild className="w-full">
              <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4 mr-2" />
                Watch Recording
              </a>
            </Button>
          ) : (
            <Button variant="outline" disabled className="w-full">
              <Video className="h-4 w-4 mr-2" />
              No Recording Available
            </Button>
          )
        ) : (
          <>
            <div className="text-xs text-muted-foreground">
              Platform: {virtualClass.meetingConfig.platform} • Passcode: {virtualClass.meetingConfig.passcode}
            </div>
            {isOngoing ? (
              <Button onClick={() => onJoin(virtualClass)} className="bg-green-600 hover:bg-green-700">
                <Video className="h-4 w-4 mr-2" />
                Join Now
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <Calendar className="h-4 w-4 mr-2" />
                Starts {formatDate(virtualClass.scheduledStartTime)}
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}
