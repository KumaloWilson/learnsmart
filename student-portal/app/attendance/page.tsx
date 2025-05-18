import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AttendancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Attendance Tracking</h1>
          <div className="flex items-center gap-2">
            <Select defaultValue="current">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Semester</SelectItem>
                <SelectItem value="previous">Previous Semester</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1">
        <div className="grid gap-6">
          <section>
            <h2 className="text-lg font-medium mb-4">Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">Attended 23/25 classes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">95%</div>
                  <p className="text-xs text-muted-foreground">Arrived on time for 22/23 classes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Absences</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">1 excused, 1 unexcused</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Next: Tomorrow, 10:00 AM</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="courses">By Course</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {[
                    {
                      title: "Data Structures and Algorithms",
                      instructor: "Dr. Jane Smith",
                      schedule: "Mon, Wed, Fri - 10:00 AM",
                      attendance: 90,
                      classes: [
                        { date: "May 17, 2023", status: "present", onTime: true },
                        { date: "May 15, 2023", status: "present", onTime: true },
                        { date: "May 12, 2023", status: "present", onTime: true },
                        { date: "May 10, 2023", status: "present", onTime: false },
                        { date: "May 8, 2023", status: "absent", excused: true },
                      ],
                    },
                    {
                      title: "Web Development Fundamentals",
                      instructor: "Prof. Michael Johnson",
                      schedule: "Tue, Thu - 2:00 PM",
                      attendance: 100,
                      classes: [
                        { date: "May 16, 2023", status: "present", onTime: true },
                        { date: "May 11, 2023", status: "present", onTime: true },
                        { date: "May 9, 2023", status: "present", onTime: true },
                        { date: "May 4, 2023", status: "present", onTime: true },
                        { date: "May 2, 2023", status: "present", onTime: true },
                      ],
                    },
                    {
                      title: "Introduction to Machine Learning",
                      instructor: "Dr. Sarah Williams",
                      schedule: "Wed, Fri - 11:00 AM",
                      attendance: 87.5,
                      classes: [
                        { date: "May 17, 2023", status: "present", onTime: true },
                        { date: "May 12, 2023", status: "present", onTime: true },
                        { date: "May 10, 2023", status: "present", onTime: true },
                        { date: "May 5, 2023", status: "absent", excused: false },
                        { date: "May 3, 2023", status: "present", onTime: true },
                      ],
                    },
                  ].map((course, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{course.title}</CardTitle>
                            <CardDescription>{course.instructor}</CardDescription>
                          </div>
                          <Badge
                            className={
                              course.attendance >= 90
                                ? "bg-green-500"
                                : course.attendance >= 80
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }
                          >
                            {course.attendance}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Attendance Rate</span>
                              <span className="font-medium">{course.attendance}%</span>
                            </div>
                            <Progress value={course.attendance} className="h-2" />
                          </div>

                          <div className="text-sm text-muted-foreground mb-4">
                            <Calendar className="h-4 w-4 inline-block mr-1" />
                            <span>{course.schedule}</span>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Recent Classes</h4>
                            <ul className="space-y-2">
                              {course.classes.map((classSession, j) => (
                                <li
                                  key={j}
                                  className="flex justify-between items-center text-sm py-1 border-b last:border-0"
                                >
                                  <span>{classSession.date}</span>
                                  <div className="flex items-center">
                                    {classSession.status === "present" ? (
                                      <>
                                        <Badge
                                          variant="outline"
                                          className="bg-green-50 text-green-700 border-green-200 mr-2"
                                        >
                                          Present
                                        </Badge>
                                        {!classSession.onTime && (
                                          <Badge
                                            variant="outline"
                                            className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                          >
                                            Late
                                          </Badge>
                                        )}
                                      </>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className={
                                          classSession.excused
                                            ? "bg-blue-50 text-blue-700 border-blue-200"
                                            : "bg-red-50 text-red-700 border-red-200"
                                        }
                                      >
                                        {classSession.excused ? "Excused" : "Absent"}
                                      </Badge>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>May 2023</CardTitle>
                    <CardDescription>Attendance calendar for current month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center font-medium text-sm py-2">
                          {day}
                        </div>
                      ))}

                      {/* Empty cells for days before the 1st */}
                      {Array.from({ length: 1 }).map((_, i) => (
                        <div key={`empty-start-${i}`} className="h-20 border rounded-md bg-muted/20"></div>
                      ))}

                      {/* Calendar days */}
                      {Array.from({ length: 31 }).map((_, i) => {
                        const day = i + 1
                        const hasClass = [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19].includes(day)
                        const isAbsent = [5, 18].includes(day)
                        const isLate = [11].includes(day)

                        return (
                          <div
                            key={`day-${day}`}
                            className={`h-20 border rounded-md p-1 ${hasClass ? "bg-white" : "bg-muted/20"}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-medium">{day}</span>
                              {hasClass && (
                                <div>
                                  {isAbsent ? (
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  ) : isLate ? (
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                  ) : (
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  )}
                                </div>
                              )}
                            </div>
                            {hasClass && (
                              <div className="mt-1 text-xs">
                                {[1, 3, 5, 8, 10, 12, 15, 17, 19].includes(day) && (
                                  <div className="bg-blue-100 text-blue-800 rounded px-1 py-0.5 mb-0.5 truncate">
                                    DSA 10:00
                                  </div>
                                )}
                                {[2, 4, 9, 11, 16, 18].includes(day) && (
                                  <div className="bg-purple-100 text-purple-800 rounded px-1 py-0.5 mb-0.5 truncate">
                                    Web 2:00
                                  </div>
                                )}
                                {[3, 5, 10, 12, 17, 19].includes(day) && (
                                  <div className="bg-green-100 text-green-800 rounded px-1 py-0.5 truncate">
                                    ML 11:00
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {/* Empty cells for days after the last day */}
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={`empty-end-${i}`} className="h-20 border rounded-md bg-muted/20"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Late</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Absent</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </section>

          <section>
            <h2 className="text-lg font-medium mb-4">Upcoming Classes</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Introduction to Linked Lists",
                  course: "Data Structures and Algorithms",
                  date: "Tomorrow",
                  time: "10:00 AM",
                  location: "Virtual Classroom",
                },
                {
                  title: "JavaScript DOM Manipulation",
                  course: "Web Development Fundamentals",
                  date: "Today",
                  time: "2:00 PM",
                  location: "Virtual Classroom",
                },
                {
                  title: "Neural Networks Introduction",
                  course: "Introduction to Machine Learning",
                  date: "Friday, May 19",
                  time: "11:00 AM",
                  location: "Virtual Classroom",
                },
              ].map((classItem, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {classItem.course}
                      </Badge>
                      {classItem.date === "Today" && <Badge className="bg-green-500 hover:bg-green-600">Today</Badge>}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{classItem.title}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {classItem.date} at {classItem.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
