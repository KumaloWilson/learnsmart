"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PageHeader } from "../../components/page-header"
import { cn } from "../../lib/utils"
import { useToast } from "../../components/ui/use-toast"

export default function ReportsPage() {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  // Student performance report
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")

  // Enrollment report
  const [enrollmentDateFrom, setEnrollmentDateFrom] = useState<Date>()
  const [enrollmentDateTo, setEnrollmentDateTo] = useState<Date>()
  const [enrollmentType, setEnrollmentType] = useState("all")

  // Attendance report
  const [attendanceDateFrom, setAttendanceDateFrom] = useState<Date>()
  const [attendanceDateTo, setAttendanceDateTo] = useState<Date>()
  const [attendanceType, setAttendanceType] = useState("physical")

  const handleGenerateStudentPerformanceReport = async () => {
    if (!selectedProgram || !selectedSemester) {
      toast({
        title: "Missing fields",
        description: "Please select a program and semester",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Report Generated",
        description: "Student performance report has been generated successfully",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateEnrollmentReport = async () => {
    if (!enrollmentDateFrom || !enrollmentDateTo) {
      toast({
        title: "Missing fields",
        description: "Please select date range",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Report Generated",
        description: "Enrollment report has been generated successfully",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateAttendanceReport = async () => {
    if (!attendanceDateFrom || !attendanceDateTo) {
      toast({
        title: "Missing fields",
        description: "Please select date range",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Report Generated",
        description: "Attendance report has been generated successfully",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader heading="Reports" text="Generate and download system reports" />

      <Tabs defaultValue="student-performance" className="mt-8">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="student-performance">Student Performance</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="student-performance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Report</CardTitle>
              <CardDescription>Generate reports on student academic performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select onValueChange={setSelectedProgram}>
                  <SelectTrigger id="program">
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs">Computer Science</SelectItem>
                    <SelectItem value="eng">Engineering</SelectItem>
                    <SelectItem value="bus">Business Administration</SelectItem>
                    <SelectItem value="med">Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select onValueChange={setSelectedSemester}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fall2023">Fall 2023</SelectItem>
                    <SelectItem value="spring2024">Spring 2024</SelectItem>
                    <SelectItem value="summer2024">Summer 2024</SelectItem>
                    <SelectItem value="fall2024">Fall 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course (Optional)</Label>
                <Select onValueChange={setSelectedCourse}>
                  <SelectTrigger id="course">
                    <SelectValue placeholder="Select a course or leave blank for all" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cs101">CS101: Introduction to Programming</SelectItem>
                    <SelectItem value="cs201">CS201: Data Structures</SelectItem>
                    <SelectItem value="eng101">ENG101: Engineering Fundamentals</SelectItem>
                    <SelectItem value="bus202">BUS202: Business Ethics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateStudentPerformanceReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Report</CardTitle>
              <CardDescription>Generate reports on student enrollment statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !enrollmentDateFrom && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {enrollmentDateFrom ? format(enrollmentDateFrom, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={enrollmentDateFrom}
                        onSelect={setEnrollmentDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !enrollmentDateTo && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {enrollmentDateTo ? format(enrollmentDateTo, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={enrollmentDateTo} onSelect={setEnrollmentDateTo} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment-type">Enrollment Type</Label>
                <Select onValueChange={setEnrollmentType} defaultValue="all">
                  <SelectTrigger id="enrollment-type">
                    <SelectValue placeholder="Select enrollment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Enrollments</SelectItem>
                    <SelectItem value="new">New Enrollments</SelectItem>
                    <SelectItem value="transfer">Transfer Students</SelectItem>
                    <SelectItem value="returning">Returning Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateEnrollmentReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Report</CardTitle>
              <CardDescription>Generate reports on student attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !attendanceDateFrom && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {attendanceDateFrom ? format(attendanceDateFrom, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={attendanceDateFrom}
                        onSelect={setAttendanceDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !attendanceDateTo && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {attendanceDateTo ? format(attendanceDateTo, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={attendanceDateTo} onSelect={setAttendanceDateTo} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendance-type">Attendance Type</Label>
                <Select onValueChange={setAttendanceType} defaultValue="physical">
                  <SelectTrigger id="attendance-type">
                    <SelectValue placeholder="Select attendance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical Classes</SelectItem>
                    <SelectItem value="virtual">Virtual Classes</SelectItem>
                    <SelectItem value="all">All Classes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateAttendanceReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
