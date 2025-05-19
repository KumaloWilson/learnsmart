import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Video, ExternalLink, User } from "lucide-react"
import type { VirtualClass } from "@/features/courses/types"

interface CourseVirtualClassesProps {
  virtualClasses: VirtualClass[]
}

export function CourseVirtualClasses({ virtualClasses }: CourseVirtualClassesProps) {
  if (!virtualClasses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Virtual Classes</CardTitle>
          <CardDescription>No virtual classes scheduled for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Sort classes by start time (upcoming first, then past)
  const now = new Date()
  const sortedClasses = [...virtualClasses].sort((a, b) => {
    const aDate = new Date(a.scheduledStartTime)
    const bDate = new Date(b.scheduledStartTime)
    const aIsPast = aDate < now
    const bIsPast = bDate < now

    if (aIsPast && !bIsPast) return 1
    if (!aIsPast && bIsPast) return -1
    return aDate.getTime() - bDate.getTime()
  })

  return (
    <div className="space-y-4">
      {sortedClasses.map((virtualClass) => {
        const startDate = new Date(virtualClass.scheduledStartTime)
        const endDate = new Date(virtualClass.scheduledEndTime)
        const isPast = startDate < now
        const isOngoing = startDate <= now && endDate >= now

        // Format date and time
        const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" }
        const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }

        const formattedDate = startDate.toLocaleDateString(undefined, dateOptions)
        const formattedStartTime = startDate.toLocaleTimeString(undefined, timeOptions)
        const formattedEndTime = endDate.toLocaleTimeString(undefined, timeOptions)

        // Calculate days until class
        const daysUntil = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        return (
          <Card key={virtualClass.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{virtualClass.title}</CardTitle>
                  <CardDescription>{virtualClass.description}</CardDescription>
                </div>
                <Badge
                  variant={isOngoing ? "default" : isPast ? "outline" : daysUntil <= 1 ? "destructive" : "secondary"}
                >
                  {isOngoing
                    ? "Ongoing"
                    : isPast
                      ? "Past"
                      : daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                          ? "Tomorrow"
                          : `In ${daysUntil} days`}
                </Badge>
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

              <div className="flex justify-end">
                <Button
                  disabled={isPast && !virtualClass.recordingUrl}
                  variant={isPast && !isOngoing ? "outline" : "default"}
                  asChild
                >
                  <a
                    href={virtualClass.recordingUrl || virtualClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    {isPast && !isOngoing ? (
                      virtualClass.recordingUrl ? (
                        <>
                          <span>View Recording</span>
                          <ExternalLink className="h-3 w-3" />
                        </>
                      ) : (
                        <span>Recording Not Available</span>
                      )
                    ) : (
                      <>
                        <span>Join Class</span>
                        <ExternalLink className="h-3 w-3" />
                      </>
                    )}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
