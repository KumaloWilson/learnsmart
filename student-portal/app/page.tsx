import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Calendar, Clock, GraduationCap, Search, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NotificationCenter } from "@/components/notification-center"
import Link from "next/link"
import { StudentInfo } from "@/components/dashboard/student-info"
import { CurrentEnrollments } from "@/components/dashboard/current-enrollments"
import { LearningRecommendations } from "@/components/dashboard/learning-recommendations"

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search courses..." className="w-[200px] lg:w-[300px] pl-8" />
            </div>
            <NotificationCenter />
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1">
        <div className="grid gap-6">
          <section className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold gradient-heading">Welcome back, John!</h2>
                <p className="text-muted-foreground">Here's what's happening with your learning journey today.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="dashboard-card border-l-4 border-l-blue-500 dark:border-l-blue-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
                  <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">6</div>
                  <p className="text-xs text-muted-foreground">2 in progress</p>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-l-4 border-l-amber-500 dark:border-l-amber-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                  <div className="p-1 bg-amber-100 dark:bg-amber-900 rounded-full">
                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">Next: Data Structures (Tomorrow)</p>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-l-4 border-l-green-500 dark:border-l-green-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                  <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last semester</p>
                </CardContent>
              </Card>

              <Card className="dashboard-card border-l-4 border-l-purple-500 dark:border-l-purple-400">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                  <div className="p-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">Attended 23/25 classes</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3 animate-fade-in">
            <div className="md:col-span-2">
              <Tabs defaultValue="in-progress" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">My Courses</h2>
                  <TabsList>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="in-progress" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      {
                        title: "Data Structures and Algorithms",
                        instructor: "Dr. Jane Smith",
                        progress: 65,
                        image: "/placeholder.svg?height=100&width=200",
                        nextClass: "Tomorrow, 10:00 AM",
                      },
                      {
                        title: "Web Development Fundamentals",
                        instructor: "Prof. Michael Johnson",
                        progress: 42,
                        image: "/placeholder.svg?height=100&width=200",
                        nextClass: "Today, 2:00 PM",
                      },
                    ].map((course, i) => (
                      <Card key={i} className="overflow-hidden course-card">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="object-cover w-full h-full transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                          <CardDescription>{course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              <span>Next: {course.nextClass}</span>
                            </div>
                            <Button size="sm" className="transition-all" asChild>
                              <Link href={`/courses/${i}`}>Continue</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="completed" className="space-y-4">
                  <div className="grid gap-6 md:grid-cols-2">
                    {[
                      {
                        title: "Introduction to Computer Science",
                        instructor: "Prof. Robert Davis",
                        grade: "A",
                        image: "/placeholder.svg?height=100&width=200",
                        completed: "Last semester",
                      },
                      {
                        title: "Database Management Systems",
                        instructor: "Dr. Emily Chen",
                        grade: "B+",
                        image: "/placeholder.svg?height=100&width=200",
                        completed: "Last semester",
                      },
                    ].map((course, i) => (
                      <Card key={i} className="overflow-hidden course-card">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="object-cover w-full h-full transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                          <CardDescription>{course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Final Grade</span>
                            <span
                              className={`font-medium ${
                                course.grade.startsWith("A")
                                  ? "text-green-600"
                                  : course.grade.startsWith("B")
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                              }`}
                            >
                              {course.grade}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <GraduationCap className="mr-1 h-3 w-3" />
                              <span>Completed: {course.completed}</span>
                            </div>
                            <Button size="sm" variant="outline" className="transition-all" asChild>
                              <Link href={`/courses/${i + 3}`}>Review</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <StudentInfo />
              <CurrentEnrollments />
              <LearningRecommendations />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
