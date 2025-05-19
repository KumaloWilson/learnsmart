"use client"

import { useEffect, useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useVirtualClasses } from "@/lib/auth/hooks"
import { formatTime } from "@/lib/utils"
import Link from "next/link"
import { CreateVirtualClassDialog } from "@/components/create-virtual-class-dialog"

export default function VirtualClassCalendarPage() {
  const { lecturerProfile } = useAuth()
  const { getUpcomingVirtualClasses, virtualClasses, isLoading } = useVirtualClasses()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [currentMonth, setCurrentMonth] = useState("")
  const [currentYear, setCurrentYear] = useState(0)
 console.log(virtualClasses)
  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id) {
        try {
          await getUpcomingVirtualClasses(lecturerProfile.id)
        } catch (err) {
          console.error("Error fetching virtual classes:", err)
        }
      }
    }

    fetchData()
  }, [lecturerProfile, getUpcomingVirtualClasses])

  useEffect(() => {
    // Generate calendar days for the current month
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Set month name and year
    setCurrentMonth(new Date(year, month, 1).toLocaleString("default", { month: "long" }))
    setCurrentYear(year)

    // Get first day of month
    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Get last day of month
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()

    // Create array of dates for the calendar
    const days: Date[] = []

    // Add days from previous month to start the calendar on Sunday
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push(new Date(year, month - 1, prevMonthLastDay - i))
    }

    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month to complete the calendar grid (6 rows x 7 days)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    setCalendarDays(days)
  }, [currentDate])

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getClassesForDate = (date: Date) => {
    return virtualClasses.filter((vc) => {
      const classDate = new Date(vc.scheduledStartTime)
      return (
        classDate.getDate() === date.getDate() &&
        classDate.getMonth() === date.getMonth() &&
        classDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  if (isLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <PageContainer 
      title="Virtual Class Calendar"
      description="View and manage your virtual classes in a calendar view"
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)} >
          <Plus className="mr-2 h-4 w-4" /> Create Virtual Class
        </Button>
      }
    >
      <Card >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {currentMonth} {currentYear}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>Calendar view of all your scheduled virtual classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium p-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {calendarDays.map((date, index) => {
              const classes = getClassesForDate(date)
              return (
                <div
                  key={index}
                  className={`
                    min-h-[120px] border rounded-md p-1 overflow-hidden
                    ${isCurrentMonth(date) ? "bg-card" : "bg-muted/30 text-muted-foreground"}
                    ${isToday(date) ? "border-primary" : "border-border"}
                  `}
                >
                  <div className="text-right p-1">
                    <span
                      className={`text-sm ${isToday(date) ? "bg-primary text-primary-foreground rounded-full px-1.5 py-0.5" : ""}`}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {classes.slice(0, 3).map((vc) => (
                      <Link key={vc.id} href={`/virtual-classes/${vc.id}`} className="block">
                        <div className="text-xs bg-primary/10 p-1 rounded truncate hover:bg-primary/20 transition-colors">
                          <span className="font-medium">{formatTime(vc.scheduledStartTime)}</span>
                          <span className="ml-1 truncate">{vc.title}</span>
                        </div>
                      </Link>
                    ))}
                    {classes.length > 3 && (
                      <div className="text-xs text-center text-muted-foreground">+{classes.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <CreateVirtualClassDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </PageContainer>
  )
}
