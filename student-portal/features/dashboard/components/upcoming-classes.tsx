import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Video, Calendar } from "lucide-react"
import { VirtualClass } from "../types"


interface UpcomingClassesProps {
  classes: VirtualClass[]
}

export function UpcomingClasses({ classes }: UpcomingClassesProps) {
  // Sort classes by start time (earliest first)
  const sortedClasses = [...classes].sort(
    (a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime(),
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedClasses.map((virtualClass) => {
        const startDate = new Date(virtualClass.scheduledStartTime)
        const endDate = new Date(virtualClass.scheduledEndTime)

        // Format date and time
        const dateOptions: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" }
        const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }

        const formattedDate = startDate.toLocaleDateString(undefined, dateOptions)
        const formattedStartTime = startDate.toLocaleTimeString(undefined, timeOptions)
        const formattedEndTime = endDate.toLocaleTimeString(undefined, timeOptions)

        // Calculate days until class
        const today = new Date()
        const daysUntil = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        return (
          <Card key={virtualClass.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{virtualClass.title}</CardTitle>
                  <CardDescription className="line-clamp-1">
                    {virtualClass.course.name} ({virtualClass.course.code})
                  </CardDescription>
                </div>
                <Badge variant={daysUntil <= 1 ? "destructive" : daysUntil <= 3 ? "default" : "outline"}>
                  {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {virtualClass.description || "No description provided"}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formattedDate}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formattedStartTime} - {formattedEndTime}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="font-medium">Lecturer:</span> {virtualClass.lecturerProfile.title}{" "}
                  {virtualClass.lecturerProfile.user.firstName} {virtualClass.lecturerProfile.user.lastName}
                </div>

                <Button size="sm" className="w-full mt-2" asChild>
                  <a
                    href={virtualClass.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1"
                  >
                    <span>Join Class</span>
                    <ExternalLink className="h-3 w-3" />
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
