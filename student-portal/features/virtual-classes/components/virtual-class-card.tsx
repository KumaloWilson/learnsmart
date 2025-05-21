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
import { formatDate, formatTime } from "@/lib/utils"

interface VirtualClassCardProps {
  virtualClass: VirtualClass
  showCourse?: boolean
}

// Helper function to parse time string like "8:35 AM" into hours and minutes
function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  // Expected format: "8:35 AM" or "08:35 AM"
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  
  // Convert to 24-hour format
  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
}

export function VirtualClassCard({ virtualClass, showCourse = false }: VirtualClassCardProps) {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { isJoining, joinError } = useAppSelector((state) => state.virtualClasses)
  const { toast } = useToast()
  const [classStatus, setClassStatus] = useState<VirtualClassStatus>(VirtualClassStatus.UPCOMING)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  // Format the date for display
  const formattedDate = formatDate(virtualClass.scheduledStartTime)
  
  // Format times for display
  const formattedStartTime = formatTime(virtualClass.scheduledStartTime)
  const formattedEndTime = formatTime(virtualClass.scheduledEndTime)

  useEffect(() => {
    const updateTimeRemaining = () => {
      const now = new Date();
      
      // Parse the formatted start and end times (which should be displaying correctly)
      const startTimeParsed = parseTimeString(formattedStartTime);
      const endTimeParsed = parseTimeString(formattedEndTime);
      
      // Create today's date with these times
      const startDate = new Date();
      startDate.setHours(startTimeParsed.hours, startTimeParsed.minutes, 0, 0);
      
      const endDate = new Date();
      endDate.setHours(endTimeParsed.hours, endTimeParsed.minutes, 0, 0);
      
      console.log("Current time:", now.toLocaleTimeString());
      console.log("Start time today:", startDate.toLocaleTimeString());
      console.log("End time today:", endDate.toLocaleTimeString());

      // Class duration in minutes
      const classDurationMinutes = Math.round((endDate.getTime() - startDate.getTime()) / 60000);
      console.log("Class duration in minutes:", classDurationMinutes);
      
      // Time until start/end in minutes
      const minutesUntilStart = Math.max(0, Math.round((startDate.getTime() - now.getTime()) / 60000));
      const minutesUntilEnd = Math.max(0, Math.round((endDate.getTime() - now.getTime()) / 60000));
      
      console.log("Minutes until start:", minutesUntilStart);
      console.log("Minutes until end:", minutesUntilEnd);

      // Determine class status
      if (now > endDate) {
        console.log("Class is PAST");
        setClassStatus(VirtualClassStatus.PAST);
        setTimeRemaining("");
      } 
      else if (now >= startDate) {
        console.log("Class is ONGOING");
        setClassStatus(VirtualClassStatus.ONGOING);
        
        // Ensure remaining time doesn't exceed class duration
        const remainingMins = Math.min(minutesUntilEnd, classDurationMinutes);
        
        if (remainingMins < 60) {
          setTimeRemaining(`${remainingMins}m remaining`);
        } else {
          const hoursRemaining = Math.floor(remainingMins / 60);
          const minutesRemaining = remainingMins % 60;
          setTimeRemaining(`${hoursRemaining}h ${minutesRemaining}m remaining`);
        }
      } 
      else if (minutesUntilStart <= 5) {
        console.log("Class is JOINABLE");
        setClassStatus(VirtualClassStatus.JOINABLE);
        setTimeRemaining(`Starts in ${minutesUntilStart}m`);
      } 
      else {
        console.log("Class is UPCOMING");
        setClassStatus(VirtualClassStatus.UPCOMING);
        
        if (minutesUntilStart < 60) {
          setTimeRemaining(`Starts in ${minutesUntilStart}m`);
        } else if (minutesUntilStart < 1440) {
          const hoursUntilStart = Math.floor(minutesUntilStart / 60);
          const minutesRemaining = minutesUntilStart % 60;
          setTimeRemaining(`Starts in ${hoursUntilStart}h ${minutesRemaining}m`);
        } else {
          const daysUntilStart = Math.floor(minutesUntilStart / 1440);
          setTimeRemaining(`Starts in ${daysUntilStart} day${daysUntilStart > 1 ? "s" : ""}`);
        }
      }
    };

    // Run initially
    updateTimeRemaining();
    
    // Update every minute
    const interval = setInterval(updateTimeRemaining, 60000);
    return () => clearInterval(interval);
  }, [formattedStartTime, formattedEndTime]);

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