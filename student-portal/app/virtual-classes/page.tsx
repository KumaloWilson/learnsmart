"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { fetchVirtualClasses } from "@/lib/redux/slices/virtualClassSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Calendar, Clock, Users, Video, ExternalLink } from "lucide-react"
import { formatDate, formatTime, getTimeRemaining } from "@/lib/utils/date-utils"
import { MainLayout } from "@/components/main-layout"

export default function VirtualClassesPage() {
  const dispatch = useAppDispatch()
  const { virtualClasses, isLoading, error } = useAppSelector((state) => state.virtualClass)
  const { accessToken } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchVirtualClasses(accessToken))
    }
  }, [dispatch, accessToken])

  // Group classes by date
  const groupedClasses = virtualClasses.reduce((groups, virtualClass) => {
    const date = formatDate(virtualClass.scheduledStartTime)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(virtualClass)
    return groups
  }, {})

  // Sort dates
  const sortedDates = Object.keys(groupedClasses).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  const content = (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Virtual Classes</h1>
        <p className="text-muted-foreground">Join live classes and access recordings</p>
      </div>

      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : virtualClasses.length === 0 ? (
        <Alert>
          <AlertDescription>No virtual classes scheduled at this time.</AlertDescription>
        </Alert>
      ) : (
        sortedDates.map((date) => (
          <div key={date} className="space-y-4">
            <h2 className="text-xl font-semibold">{date}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {groupedClasses[date]
                .sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())
                .map((virtualClass) => (
                  <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} />
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  )

  return <MainLayout>{content}</MainLayout>
}

function VirtualClassCard({ virtualClass }) {
  const now = new Date()
  const startTime = new Date(virtualClass.scheduledStartTime)
  const endTime = new Date(virtualClass.scheduledEndTime)

  const isLive = now >= startTime && now <= endTime
  const isPast = now > endTime
  const isFuture = now < startTime

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{virtualClass.title}</CardTitle>
            <CardDescription className="mt-1">
              {virtualClass.course.name} ({virtualClass.course.code})
            </CardDescription>
          </div>
          <Badge
            className={
              isLive
                ? "bg-green-100 text-green-800 hover:bg-green-200 border-none"
                : isPast
                  ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border-none"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-none"
            }
          >
            {isLive ? "Live Now" : isPast ? "Completed" : getTimeRemaining(virtualClass.scheduledStartTime)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatTime(virtualClass.scheduledStartTime)} - {formatTime(virtualClass.scheduledEndTime)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {virtualClass.lecturerProfile.title} {virtualClass.lecturerProfile.user.firstName}{" "}
              {virtualClass.lecturerProfile.user.lastName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(virtualClass.scheduledStartTime)}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{virtualClass.description}</p>

        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Platform: {virtualClass.meetingConfig.platform}
            {virtualClass.meetingConfig.passcode && ` • Passcode: ${virtualClass.meetingConfig.passcode}`}
          </div>
          <Button asChild size="sm" disabled={isPast && !virtualClass.recordingUrl}>
            {isPast && virtualClass.recordingUrl ? (
              <a href={virtualClass.recordingUrl} target="_blank" rel="noopener noreferrer">
                <Video className="h-4 w-4 mr-2" />
                View Recording
              </a>
            ) : (
              <a
                href={virtualClass.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className={isPast ? "pointer-events-none" : ""}
              >
                <Video className="h-4 w-4 mr-2" />
                {isLive ? "Join Now" : isFuture ? "Join When Live" : "No Recording"}
                {!isPast && <ExternalLink className="h-3 w-3 ml-1" />}
              </a>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
