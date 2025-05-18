"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { useAppSelector } from "@/lib/redux/hooks"
import { useGetQuizAttemptsQuery, type QuizAttemptFilter } from "@/lib/api/quiz"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle, Clock, XCircle, Search, RotateCcw, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

export default function QuizHistoryPage() {
  const router = useRouter()
  const { profile } = useAppSelector((state) => state.student)
  const [filters, setFilters] = useState<QuizAttemptFilter>({})
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  // Query for quiz attempts with the current student profile ID
  const {
    data: quizAttempts,
    isLoading,
    refetch,
  } = useGetQuizAttemptsQuery({ studentProfileId: profile?.id || "" }, { skip: !profile?.id })

  // Reset filters
  const handleResetFilters = () => {
    setFilters({})
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP")
  }

  // Format time for display
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "p")
  }

  // Calculate duration in minutes
  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return "In progress"

    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    const durationMinutes = Math.round((end - start) / (1000 * 60))

    return `${durationMinutes} min`
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
      case "timed_out":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Timed Out</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Filter quiz attempts based on search criteria
  const filteredAttempts = quizAttempts?.filter((attempt) => {
    let matches = true

    if (filters.quizId && attempt.quizId !== filters.quizId) {
      matches = false
    }

    if (filters.status && attempt.status !== filters.status) {
      matches = false
    }

    if (filters.startDate) {
      const filterDate = new Date(filters.startDate)
      const attemptDate = new Date(attempt.startTime)
      if (attemptDate < filterDate) {
        matches = false
      }
    }

    if (filters.endDate) {
      const filterDate = new Date(filters.endDate)
      const attemptDate = new Date(attempt.startTime)
      if (attemptDate > filterDate) {
        matches = false
      }
    }

    return matches
  })

  // View quiz attempt details
  const viewQuizAttempt = (attemptId: string) => {
    router.push(`/quiz-attempts/${attemptId}`)
  }

  if (!profile?.id) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz History</CardTitle>
            <CardDescription>You need to be logged in to view your quiz history.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
          <CardDescription>View your past quiz attempts and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="timed_out">Timed Out</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(new Date(filters.startDate), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.startDate ? new Date(filters.startDate) : undefined}
                    onSelect={(date) => {
                      setFilters({ ...filters, startDate: date ? date.toISOString() : undefined })
                      setStartDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.endDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(new Date(filters.endDate), "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.endDate ? new Date(filters.endDate) : undefined}
                    onSelect={(date) => {
                      setFilters({ ...filters, endDate: date ? date.toISOString() : undefined })
                      setEndDateOpen(false)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end gap-2">
              <Button variant="outline" onClick={handleResetFilters} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={() => refetch()} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[125px] w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : filteredAttempts && filteredAttempts.length > 0 ? (
            <div className="space-y-4">
              {filteredAttempts.map((attempt) => (
                <Card key={attempt.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold">{attempt.quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">{attempt.quiz.course.name}</p>
                        </div>
                        <div>{getStatusBadge(attempt.status)}</div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="text-sm font-medium">{formatDate(attempt.startTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Time</p>
                          <p className="text-sm font-medium">{formatTime(attempt.startTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="text-sm font-medium">{calculateDuration(attempt.startTime, attempt.endTime)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-sm font-medium">
                            {attempt.score !== null ? (
                              <span className="flex items-center gap-1">
                                {attempt.score}%
                                {attempt.isPassed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> In progress
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted p-6 flex items-center justify-center md:w-48">
                      <Button onClick={() => viewQuizAttempt(attempt.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No quiz attempts found matching your filters.</p>
              {Object.keys(filters).length > 0 && (
                <Button variant="outline" onClick={handleResetFilters} className="mt-4">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
