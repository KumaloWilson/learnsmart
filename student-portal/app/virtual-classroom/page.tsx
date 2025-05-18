import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MonitorPlay, Users, Video } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function VirtualClassroomPage() {
  const upcomingClasses = [
    {
      id: 1,
      title: "Introduction to Linked Lists",
      course: "Data Structures and Algorithms",
      instructor: "Dr. Jane Smith",
      time: "Tomorrow, 10:00 AM",
      duration: "1 hour",
      participants: 28,
      image: "/placeholder-user.jpg",
    },
    {
      id: 2,
      title: "JavaScript DOM Manipulation",
      course: "Web Development Fundamentals",
      instructor: "Prof. Michael Johnson",
      time: "Today, 2:00 PM",
      duration: "1.5 hours",
      participants: 35,
      image: "/placeholder-user.jpg",
    },
    {
      id: 3,
      title: "Neural Networks Introduction",
      course: "Introduction to Machine Learning",
      instructor: "Dr. Sarah Williams",
      time: "Friday, 11:00 AM",
      duration: "2 hours",
      participants: 42,
      image: "/placeholder-user.jpg",
    },
  ]

  const pastClasses = [
    {
      id: 4,
      title: "Arrays and Strings",
      course: "Data Structures and Algorithms",
      instructor: "Dr. Jane Smith",
      date: "May 15, 2023",
      duration: "1 hour",
      recording: true,
      image: "/placeholder-user.jpg",
    },
    {
      id: 5,
      title: "HTML and CSS Basics",
      course: "Web Development Fundamentals",
      instructor: "Prof. Michael Johnson",
      date: "May 13, 2023",
      duration: "1.5 hours",
      recording: true,
      image: "/placeholder-user.jpg",
    },
    {
      id: 6,
      title: "Introduction to Machine Learning",
      course: "Introduction to Machine Learning",
      instructor: "Dr. Sarah Williams",
      date: "May 10, 2023",
      duration: "2 hours",
      recording: true,
      image: "/placeholder-user.jpg",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold md:text-2xl">Virtual Classroom</h1>
        </div>
      </header>

      <div className="container px-4 py-6 flex-1">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
            <TabsTrigger value="past">Past Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingClasses.map((classItem) => (
                <Card key={classItem.id} className="flex flex-col card-hover-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Upcoming
                      </Badge>
                      {classItem.time.includes("Today") && (
                        <Badge className="bg-green-500 hover:bg-green-600">Today</Badge>
                      )}
                    </div>
                    <CardTitle className="mt-2">{classItem.title}</CardTitle>
                    <CardDescription>{classItem.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={classItem.image || "/placeholder.svg"} />
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{classItem.instructor}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.participants} participants</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/virtual-classroom/${classItem.id}`}>Join Class</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastClasses.map((classItem) => (
                <Card key={classItem.id} className="flex flex-col card-hover-effect">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                        Completed
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{classItem.title}</CardTitle>
                    <CardDescription>{classItem.course}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={classItem.image || "/placeholder.svg"} />
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{classItem.instructor}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.duration}</span>
                      </div>
                      {classItem.recording && (
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          <span>Recording available</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href={`/virtual-classroom/${classItem.id}`}>Watch Recording</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Active Now</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-hover-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-red-500 hover:bg-red-600">Live Now</Badge>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-red-500">42 attending</span>
                  </div>
                </div>
                <CardTitle className="mt-2">JavaScript DOM Manipulation</CardTitle>
                <CardDescription>Web Development Fundamentals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="gap-2">
                      <Video className="h-4 w-4" />
                      Join Stream
                    </Button>
                  </div>
                  <MonitorPlay className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Prof. Michael Johnson</p>
                    <p className="text-xs text-muted-foreground">Started 25 minutes ago</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/virtual-classroom/2">Join Now</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
