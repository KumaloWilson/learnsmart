"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { joinVirtualClass, leaveVirtualClass } from "@/lib/api/virtual-classes-api"
import { Calendar, Clock, Users, Video, MessageSquare, FileText, File } from "lucide-react"

interface VirtualClassDetailsProps {
  virtualClass: any
}

export function VirtualClassDetails({ virtualClass }: VirtualClassDetailsProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(virtualClass.hasJoined || false)
  const [attendeeCount, setAttendeeCount] = useState(virtualClass.attendeeCount || 0)

  const startTime = new Date(virtualClass.scheduledStartTime)
  const endTime = new Date(virtualClass.scheduledEndTime)
  const isLive = new Date() >= startTime && new Date() <= endTime
  const isPast = new Date() > endTime
  const isFuture = new Date() < startTime

  const handleJoin = async () => {
    if (!user?.studentProfileId) return

    setIsJoining(true)
    try {
      await joinVirtualClass({
        virtualClassId: virtualClass.id,
        studentProfileId: user.studentProfileId,
      })

      setHasJoined(true)
      setAttendeeCount((prev) => prev + 1)

      toast({
        title: "Joined Virtual Class",
        description: "You have successfully joined the virtual class.",
      })

      // In a real app, this would redirect to the virtual classroom interface
      window.open(virtualClass.meetingUrl, "_blank")
    } catch (error) {
      console.error("Error joining virtual class:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join the virtual class. Please try again.",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeave = async () => {
    if (!user?.studentProfileId) return

    try {
      await leaveVirtualClass({
        virtualClassId: virtualClass.id,
        studentProfileId: user.studentProfileId,
      })

      setHasJoined(false)
      setAttendeeCount((prev) => Math.max(0, prev - 1))

      toast({
        title: "Left Virtual Class",
        description: "You have left the virtual class.",
      })
    } catch (error) {
      console.error("Error leaving virtual class:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to leave the virtual class. Please try again.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{virtualClass.title}</CardTitle>
              <CardDescription>{virtualClass.course?.name}</CardDescription>
            </div>
            <Badge variant={isLive ? "success" : isPast ? "secondary" : "outline"}>
              {isLive ? "Live Now" : isPast ? "Completed" : "Upcoming"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {startTime.toLocaleDateString()}{" "}
                {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Duration: {Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} minutes</span>
            </div>
          </div>

          <div className="prose max-w-none dark:prose-invert">
            <h3>Description</h3>
            <p>{virtualClass.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Attendees: {attendeeCount}</span>
          </div>

          {virtualClass.lecturer && (
            <div>
              <h3 className="text-lg font-medium mb-2">Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {virtualClass.lecturer.avatarUrl ? (
                    <img
                      src={virtualClass.lecturer.avatarUrl || "/placeholder.svg"}
                      alt={virtualClass.lecturer.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium">{virtualClass.lecturer.name?.charAt(0) || "L"}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{virtualClass.lecturer.name}</p>
                  <p className="text-sm text-muted-foreground">{virtualClass.lecturer.title}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            {isLive ? (
              <>
                {hasJoined ? (
                  <>
                    <Button className="flex-1" onClick={() => window.open(virtualClass.meetingUrl, "_blank")}>
                      <Video className="h-4 w-4 mr-2" />
                      Rejoin Class
                    </Button>
                    <Button variant="outline" onClick={handleLeave}>
                      Leave Class
                    </Button>
                  </>
                ) : (
                  <Button className="flex-1" onClick={handleJoin} disabled={isJoining}>
                    {isJoining ? (
                      "Joining..."
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Join Live Class
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : isPast ? (
              <>
                {virtualClass.recordingUrl ? (
                  <Button className="flex-1" onClick={() => window.open(virtualClass.recordingUrl, "_blank")}>
                    <Video className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                ) : (
                  <Button className="flex-1" disabled>
                    Recording Not Available
                  </Button>
                )}
              </>
            ) : (
              <Button className="flex-1" disabled>
                Class Starts in {Math.ceil((startTime.getTime() - new Date().getTime()) / (1000 * 60))} minutes
              </Button>
            )}

            <Button variant="outline" asChild>
              <a href={`/courses/${virtualClass.courseId}`}>View Course</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {virtualClass.materials && virtualClass.materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Class Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {virtualClass.materials.map((material: any) => (
                <li key={material.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      {material.type === "pdf" ? (
                        <FileText className="h-4 w-4" />
                      ) : material.type === "video" ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                    </div>
                    <span>{material.title}</span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`/materials/${material.id}`}>View</a>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Class Chat</CardTitle>
        </CardHeader>
        <CardContent>
          {isLive || isPast ? (
            <div className="space-y-4">
              <div className="h-[300px] border rounded-md p-4 overflow-y-auto">
                {virtualClass.messages && virtualClass.messages.length > 0 ? (
                  <div className="space-y-3">
                    {virtualClass.messages.map((message: any) => (
                      <div key={message.id} className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          {message.user.avatarUrl ? (
                            <img
                              src={message.user.avatarUrl || "/placeholder.svg"}
                              alt={message.user.name}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium">{message.user.name?.charAt(0) || "U"}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-medium text-sm">{message.user.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">No messages yet</div>
                )}
              </div>

              {isLive && hasJoined ? (
                <div className="flex gap-2">
                  <input type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 rounded-md border" />
                  <Button>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Chat will be available when the class starts</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
