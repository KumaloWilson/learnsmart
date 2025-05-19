"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { joinVirtualClass } from "@/features/virtual-classes/redux/virtualClassesSlice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, ExternalLink, User, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import type { VirtualClass } from "@/features/virtual-classes/types"
import { VirtualClassStatus } from "@/features/virtual-classes/types"

interface VirtualClassCardProps {
  virtualClass: VirtualClass
  showCourse?: boolean
}

export function VirtualClassCard({ virtualClass, showCourse = false }: VirtualClassCardProps) {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { isJoining, joinError } = useAppSelector((state) => state.virtualClasses)
  const { toast } = useToast()
  const [classStatus, setClassStatus] = useState<VirtualClassStatus>(VirtualClassStatus.UPCOMING)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  const startDate = new Date(virtualClass.scheduledStartTime)
  const endDate = new Date(virtualClass.scheduledEndTime)
  const now = new Date()

  // Format date and time
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" }
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }

  const formattedDate = startDate.toLocaleDateString(undefined, dateOptions)
  const formattedStartTime = startDate.toLocaleTimeString(undefined, timeOptions)
  const formattedEndTime = endDate.toLocaleTimeString(undefined, timeOptions)

  // Calculate time until class starts
  useEffect(() => {
    const updateStatus = () => {
      const now = new Date()
      const startDate = new Date(virtualClass.scheduledStartTime)
      const endDate = new Date(virtualClass.scheduledEndTime)

      // Time difference in milliseconds
      const timeDiff = startDate.getTime() - now.getTime()

      // Calculate minutes before class starts
      const minutesBeforeStart = Math.floor(timeDiff / (1000 * 60))

      if (now > endDate) {
        // Class is over
        setClassStatus(VirtualClassStatus.PAST)
        setTimeRemaining("")
      } else if (now >= startDate) {
        // Class is ongoing
        setClassStatus(VirtualClassStatus.ONGOING)

        // Calculate time remaining in class
        const endTimeDiff = endDate.getTime() - now.getTime()
        const hoursRemaining = Math.floor(endTimeDiff / (1000 * 60 * 60))
        const minutesRemaining = Math.floor((endTimeDiff % (1000 * 60 * 60)) / (1000 * 60))

        setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m remaining`)
      } else if (minutesBeforeStart <= 5) {
        // Within 5 minutes of start time
        setClassStatus(VirtualClassStatus.JOINABLE)
        setTimeRemaining(`Starts in ${minutesBeforeStart}m`)
      } else {
        // More than 5 minutes before start time
        setClassStatus(VirtualClassStatus.UPCOMING)

        // Format time remaining
        if (minutesBeforeStart < 60) {
          // Less than an hour
          setTimeRemaining(`Starts in ${minutesBeforeStart}m`)
        } else if (minutesBeforeStart < 1440) {
          // Less than a day
          const hoursBeforeStart = Math.floor(minutesBeforeStart / 60)
          const remainingMinutes = minutesBeforeStart % 60
          setTimeRemaining(`Starts in ${hoursBeforeStart}h ${remainingMinutes}m`)
        } else {
          // More than a day
          const daysBeforeStart = Math.floor(minutesBeforeStart / 1440)
          setTimeRemaining(`Starts in ${daysBeforeStart} day${daysBeforeStart > 1 ? "s" : ""}`)
        }
      }
    }

    // Update immediately
    updateStatus()

    // Update every minute
    const interval = setInterval(updateStatus, 60000)

    return () => clearInterval(interval)
  }, [virtualClass.scheduledStartTime, virtualClass.scheduledEndTime])

  const handleJoinClass = async () => {
    if (!studentProfile?.id || !accessToken) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to join a class",
        variant: "destructive",
      })
      return
    }

    const result = await dispatch(
      joinVirtualClass({
        studentProfileId: studentProfile.id,
        virtualClassId: virtualClass.id,
        token: accessToken,
      }),
    )

    if (joinVirtualClass.fulfilled.match(result)) {
      // Open the meeting link in a new tab
      window.open(virtualClass.meetingLink, "_blank")

      toast({
        title: "Joined Class",
        description: "You have successfully joined the virtual class",
      })
    }
  }

  // Determine badge variant and text based on class status
  const getBadgeInfo = () => {
    switch (classStatus) {
      case VirtualClassStatus.JOINABLE:
        return { variant: "default", text: "Joinable Now" }
      case VirtualClassStatus.ONGOING:
        return { variant: "default", text: "Ongoing" }
      case VirtualClassStatus.PAST:
        return { variant: "outline", text: "Past" }
      case VirtualClassStatus.UPCOMING:
      default:
        return { variant: "secondary", text: "Upcoming" }
    }
  }

  const badgeInfo = getBadgeInfo()

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{virtualClass.title}</CardTitle>
            <CardDescription>
              {showCourse && virtualClass.course
                ? `${virtualClass.course.name} (${virtualClass.course.code})`
                : virtualClass.description}
            </CardDescription>
          </div>
          <Badge variant={badgeInfo.variant as any}>{badgeInfo.text}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formattedStartTime} - {formattedEndTime}
            </span>
          </div>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
              {virtualClass.lecturerProfile.user.lastName}
            </span>
          </div>
        </div>

        <div className="flex items-center text-sm">
          <Video className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            Platform: {virtualClass.meetingConfig.platform} • Passcode: {virtualClass.meetingConfig.passcode}
          </span>
        </div>

        {timeRemaining && (
          <div
            className={`text-sm font-medium ${
              classStatus === VirtualClassStatus.JOINABLE || classStatus === VirtualClassStatus.ONGOING
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {timeRemaining}
          </div>
        )}

        {joinError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{joinError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          {virtualClass.attended && classStatus === VirtualClassStatus.PAST && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Attended
            </Badge>
          )}

          <div className="flex-grow"></div>

          <Button
            disabled={
              classStatus === VirtualClassStatus.PAST ||
              (classStatus === VirtualClassStatus.UPCOMING && !virtualClass.recordingUrl) ||
              isJoining
            }
            variant={classStatus === VirtualClassStatus.PAST && virtualClass.recordingUrl ? "outline" : "default"}
            onClick={handleJoinClass}
            className="ml-auto"
          >
            {isJoining ? (
              "Joining..."
            ) : classStatus === VirtualClassStatus.PAST ? (
              virtualClass.recordingUrl ? (
                <>
                  <span>View Recording</span>
                  <ExternalLink className="ml-1 h-3 w-3" />
                </>
              ) : (
                "Recording Not Available"
              )
            ) : classStatus === VirtualClassStatus.JOINABLE || classStatus === VirtualClassStatus.ONGOING ? (
              <>
                <span>Join Now</span>
                <ExternalLink className="ml-1 h-3 w-3" />
              </>
            ) : (
              "Not Available Yet"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
