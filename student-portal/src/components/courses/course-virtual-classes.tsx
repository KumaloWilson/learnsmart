"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Users, Video } from "lucide-react"

interface CourseVirtualClassesProps {
  virtualClasses: any[]
  isLoading: boolean
}

export function CourseVirtualClasses({ virtualClasses, isLoading }: CourseVirtualClassesProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!virtualClasses || virtualClasses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Virtual Classes Available</CardTitle>
          <CardDescription>There are no virtual classes scheduled for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getStatusBadge = (virtualClass: any) => {
    const now = new Date()
    const startTime = new Date(virtualClass.scheduledStartTime)
    const endTime = new Date(virtualClass.scheduledEndTime)

    if (now >= startTime && now <= endTime) {
      return <Badge className="bg-green-500">Live Now</Badge>
    } else if (now < startTime) {
      return <Badge variant="outline">Upcoming</Badge>
    } else {
      return <Badge variant="secondary">Completed</Badge>
    }
  }

  return (
    <div className="space-y-4">
      {virtualClasses.map((virtualClass) => {
        const startTime = new Date(virtualClass.scheduledStartTime)
        const endTime = new Date(virtualClass.scheduledEndTime)
        const isLive = new Date() >= startTime && new Date() <= endTime
        const isPast = new Date() > endTime

        return (
          <Card key={virtualClass.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{virtualClass.title}</CardTitle>
                  <CardDescription>{virtualClass.description}</CardDescription>
                </div>
                {getStatusBadge(virtualClass)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {startTime.toLocaleDateString()}{" "}
                      {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                      {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Duration: {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutes
                    </span>
                  </div>
                  {virtualClass.attendeeCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Attendees: {virtualClass.attendeeCount}</span>
                    </div>
                  )}
                </div>
                <Button size="sm" variant={isLive ? "default" : isPast ? "outline" : "secondary"} asChild>
                  <Link href={`/virtual-classes/${virtualClass.id}`}>
                    {isLive ? (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Join Now
                      </>
                    ) : isPast ? (
                      "View Recording"
                    ) : (
                      "View Details"
                    )}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
