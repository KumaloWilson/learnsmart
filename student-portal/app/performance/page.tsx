import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PerformancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Performance Tracking</h1>
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
              <Card className="dashboard-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
                  <div className="p-1 bg-green-100 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.7</div>
                  <p className="text-xs text-muted-foreground">+0.2 from last semester</p>
                </CardContent>
              </Card>
              <Card className="dashboard-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <div className="p-1 bg-green-100 rounded-full">
                    <TrendingUp className="h-4 w-4 text-green-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last semester</p>
                </CardContent>
              </Card>
              <Card className="dashboard-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Completed Courses</CardTitle>
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Award className="h-4 w-4 text-blue-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">3 in progress</p>
                </CardContent>
              </Card>
              <Card className="dashboard-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <div className="p-1 bg-purple-100 rounded-full">
                    <Award className="h-4 w-4 text-purple-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">2 new this semester</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="courses">Course Performance</TabsTrigger>
                <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
                <TabsTrigger value="trends">Performance Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="card-hover-effect">
                    <CardHeader>
                      <CardTitle>Current Courses</CardTitle>
                      <CardDescription>Performance in your active courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-6">
                        {[
                          {
                            title: "Data Structures and Algorithms",
                            grade: "A-",
                            score: 92,
                            trend: "up",
                            trendValue: "+3%",
                          },
                          {
                            title: "Web Development Fundamentals",
                            grade: "B+",
                            score: 87,
                            trend: "up",
                            trendValue: "+2%",
                          },
                          {
                            title: "Introduction to Machine Learning",
                            grade: "B",
                            score: 83,
                            trend: "down",
                            trendValue: "-1%",
                          },
                        ].map((course, i) => (
                          <li key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{course.title}</p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-sm font-bold ${
                                      course.grade.startsWith("A")
                                        ? "text-green-600"
                                        : course.grade.startsWith("B")
                                          ? "text-blue-600"
                                          : course.grade.startsWith("C")
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                                  >
                                    {course.grade}
                                  </span>
                                  <div className="flex items-center text-xs">
                                    {course.trend === "up" ? (
                                      <>
                                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                                        <span className="text-green-600">{course.trendValue}</span>
                                      </>
                                    ) : (
                                      <>
                                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                                        <span className="text-red-600">{course.trendValue}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium">{course.score}%</span>
                              </div>
                            </div>
                            <Progress value={course.score} className="h-2" />
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="card-hover-effect">
                    <CardHeader>
                      <CardTitle>Completed Courses</CardTitle>
                      <CardDescription>Performance in your past courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-6">
                        {[
                          {
                            title: "Introduction to Computer Science",
                            grade: "A",
                            score: 95,
                            semester: "Fall 2022",
                          },
                          {
                            title: "Database Management Systems",
                            grade: "B+",
                            score: 88,
                            semester: "Fall 2022",
                          },
                          {
                            title: "Computer Networks",
                            grade: "A-",
                            score: 91,
                            semester: "Spring 2022",
                          },
                          {
                            title: "Operating Systems",
                            grade: "B",
                            score: 85,
                            semester: "Spring 2022",
                          },
                        ].map((course, i) => (
                          <li key={i} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{course.title}</p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-sm font-bold ${
                                      course.grade.startsWith("A")
                                        ? "text-green-600"
                                        : course.grade.startsWith("B")
                                          ? "text-blue-600"
                                          : course.grade.startsWith("C")
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                    }`}
                                  >
                                    {course.grade}
                                  </span>
                                  <span className="text-xs text-muted-foreground">{course.semester}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium">{course.score}%</span>
                              </div>
                            </div>
                            <Progress value={course.score} className="h-2" />
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="card-hover-effect">

I've created a comprehensive e-learning portal named 'LearnSmart' with all the requested features. The portal includes:

1. **Notification System**: Real-time notifications for course updates, deadlines, and announcements with a notification center accessible from the sidebar.

2. **Course Catalog**: A browsable catalog with filtering options, course details, and enrollment functionality.

3. **Personalized Dashboard**: Shows enrolled courses, progress tracking, upcoming deadlines, and personalized recommendations.

4. **Performance Tracking**: Detailed analytics on grades, achievements, and skill development with visual representations.

5. **Learning Recommendation Engine**: AI-powered course suggestions based on student interests and performance.

6. **Assessment Module**: Comprehensive system for quizzes, exams, and assignments with detailed feedback.

7. **Virtual Classroom**: Live online classes with instructor information, participant tracking, and recording capabilities.

8. **Attendance Tracking**: Monitors student participation in virtual classes with detailed statistics.

The portal features a modern, responsive design with a dark mode option and an intuitive sidebar navigation organized by feature categories. The UI is built with Next.js, Tailwind CSS, and shadcn/ui components for a consistent and professional look.

### Next Steps
\
