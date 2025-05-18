import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, FileText, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function AssessmentsPage() {
  const upcomingAssessments = [
    {
      id: 1,
      title: "JavaScript Fundamentals Quiz",
      course: "Web Development Fundamentals",
      type: "Quiz",
      date: "May 20, 2023",
      time: "2:00 PM",
      duration: "45 minutes",
      questions: 25,
      status: "Not Started",
    },
    {
      id: 2,
      title: "Midterm Exam",
      course: "Data Structures and Algorithms",
      type: "Exam",
      date: "June 1, 2023",
      time: "10:00 AM",
      duration: "2 hours",
      questions: 50,
      status: "Not Started",
    },
    {
      id: 3,
      title: "Neural Networks Paper",
      course: "Introduction to Machine Learning",
      type: "Paper",
      date: "May 25, 2023",
      time: "11:59 PM",
      duration: "N/A",
      questions: null,
      status: "Not Started",
    },
  ]

  const completedAssessments = [
    {
      id: 4,
      title: "Data Structure Basics Quiz",
      course: "Data Structures and Algorithms",
      type: "Quiz",
      date: "May 10, 2023",
      score: 85,
      totalScore: 100,
      grade: "B",
      feedback: "Good understanding of basic concepts. Review linked lists.",
    },
    {
      id: 5,
      title: "HTML and CSS Quiz",
      course: "Web Development Fundamentals",
      type: "Quiz",
      date: "May 5, 2023",
      score: 92,
      totalScore: 100,
      grade: "A",
      feedback: "Excellent work! Great understanding of CSS selectors.",
    },
    {
      id: 6,
      title: "Introduction to AI Paper",
      course: "Introduction to Machine Learning",
      type: "Paper",
      date: "April 28, 2023",
      score: 88,
      totalScore: 100,
      grade: "B+",
      feedback: "Well-researched paper. Could improve on technical depth.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Assessments</h1>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAssessments.map((assessment) => (
                <Card key={assessment.id} className="flex flex-col card-hover-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          assessment.type === "Quiz"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : assessment.type === "Exam"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {assessment.type}
                      </Badge>
                      {new Date(assessment.date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">Soon</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2">{assessment.title}</CardTitle>
                    <CardDescription>{assessment.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {assessment.date} at {assessment.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{assessment.duration}</span>
                      </div>
                      {assessment.questions && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{assessment.questions} questions</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {assessment.type === "Paper" ? (
                      <Button className="w-full" asChild>
                        <Link href={`/assessments/${assessment.id}`}>Submit Paper</Link>
                      </Button>
                    ) : (
                      <Button className="w-full" asChild>
                        <Link href={`/assessments/${assessment.id}`}>Start {assessment.type}</Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedAssessments.map((assessment) => (
                <Card key={assessment.id} className="flex flex-col card-hover-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          assessment.type === "Quiz"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : assessment.type === "Exam"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-green-50 text-green-700 border-green-200"
                        }
                      >
                        {assessment.type}
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                        Completed
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{assessment.title}</CardTitle>
                    <CardDescription>{assessment.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Score</span>
                        <span className="font-medium">
                          {assessment.score}/{assessment.totalScore}
                        </span>
                      </div>
                      <Progress value={(assessment.score / assessment.totalScore) * 100} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span>Grade</span>
                        <span
                          className={`font-bold ${
                            assessment.grade.startsWith("A")
                              ? "text-green-600"
                              : assessment.grade.startsWith("B")
                                ? "text-blue-600"
                                : assessment.grade.startsWith("C")
                                  ? "text-yellow-600"
                                  : "text-red-600"
                          }`}
                        >
                          {assessment.grade}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium mb-1">Feedback:</p>
                        <p className="text-muted-foreground">{assessment.feedback}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/assessments/${assessment.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Study Resources</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="card-hover-effect">
              <CardHeader>
                <div className="p-2 w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center mb-2">
                  <BookOpen className="h-5 w-5 text-blue-700" />
                </div>
                <CardTitle>Practice Quizzes</CardTitle>
                <CardDescription>Test your knowledge with practice quizzes for all your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access over 500 practice questions across all your enrolled courses to prepare for upcoming
                  assessments.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Browse Practice Quizzes
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <div className="p-2 w-10 h-10 rounded-md bg-purple-100 flex items-center justify-center mb-2">
                  <FileText className="h-5 w-5 text-purple-700" />
                </div>
                <CardTitle>Study Guides</CardTitle>
                <CardDescription>Comprehensive study materials for all courses</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access detailed study guides, summaries, and review materials to help you prepare for exams and
                  quizzes.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  View Study Guides
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-hover-effect">
              <CardHeader>
                <div className="p-2 w-10 h-10 rounded-md bg-green-100 flex items-center justify-center mb-2">
                  <GraduationCap className="h-5 w-5 text-green-700" />
                </div>
                <CardTitle>Tutoring Sessions</CardTitle>
                <CardDescription>Get help from expert tutors in your field</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Schedule one-on-one or group tutoring sessions with experienced tutors to help you prepare for
                  assessments.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Schedule Tutoring
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
