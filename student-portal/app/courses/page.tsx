import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, Users, BookOpen, Star } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Next Learning Adventure</h1>
            <p className="text-blue-100 mb-6">
              Explore our comprehensive catalog of courses designed to help you achieve your academic and career goals.
            </p>
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for courses, topics, or skills..."
                className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus-visible:ring-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 flex-1">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-6">
            <div className="md:hidden relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search courses..." className="w-full pl-8" />
            </div>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filters</CardTitle>
                <div className="flex items-center justify-between">
                  <CardDescription>Refine your results</CardDescription>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Clear all
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Categories</h4>
                  <div className="space-y-2">
                    {[
                      "Computer Science",
                      "Data Science",
                      "Web Development",
                      "Artificial Intelligence",
                      "Networking",
                      "Cybersecurity",
                    ].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox id={`category-${category}`} />
                        <Label htmlFor={`category-${category}`} className="text-sm font-normal cursor-pointer">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Difficulty Level</h4>
                  <div className="space-y-2">
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={`level-${level}`} />
                        <Label htmlFor={`level-${level}`} className="text-sm font-normal cursor-pointer">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Duration</h4>
                  <div className="space-y-2">
                    {["< 4 weeks", "4-8 weeks", "8-12 weeks", "> 12 weeks"].map((duration) => (
                      <div key={duration} className="flex items-center space-x-2">
                        <Checkbox id={`duration-${duration}`} />
                        <Label htmlFor={`duration-${duration}`} className="text-sm font-normal cursor-pointer">
                          {duration}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    "JavaScript",
                    "Python",
                    "React",
                    "Machine Learning",
                    "SQL",
                    "Cloud",
                    "Algorithms",
                    "UI/UX",
                    "Mobile",
                    "Security",
                  ].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select defaultValue="featured">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  id: 1,
                  title: "Data Structures and Algorithms",
                  description: "Learn fundamental data structures and algorithms essential for computer science.",
                  instructor: "Dr. Jane Smith",
                  level: "Intermediate",
                  duration: "12 weeks",
                  students: 1245,
                  rating: 4.8,
                  image: "/placeholder.svg?height=180&width=320",
                  category: "Computer Science",
                  isNew: false,
                  color: "blue",
                },
                {
                  id: 2,
                  title: "Web Development Fundamentals",
                  description: "Master HTML, CSS, and JavaScript to build modern responsive websites.",
                  instructor: "Prof. Michael Johnson",
                  level: "Beginner",
                  duration: "8 weeks",
                  students: 2389,
                  rating: 4.6,
                  image: "/placeholder.svg?height=180&width=320",
                  category: "Web Development",
                  isNew: false,
                  color: "purple",
                },
                {
                  id: 3,
                  title: "Introduction to Machine Learning",
                  description: "Understand the basics of machine learning algorithms and applications.",
                  instructor: "Dr. Sarah Williams",
                  level: "Intermediate",
                  duration: "10 weeks",
                  students: 1876,
                  rating: 4.7,
                  image: "/placeholder.svg?height=180&width=320",
                  category: "Artificial Intelligence",
                  isNew: false,
                  color: "green",
                },
                {
                  id: 4,
                  title: "Advanced Database Systems",
                  description: "Explore advanced concepts in database design, optimization, and management.",
                  instructor: "Prof. David Chen",
                  level: "Advanced",
                  duration: "8 weeks",
                  students: 945,
                  rating: 4.9,
                  image: "/placeholder.svg?height=180&width=320",
                  category: "Computer Science",
                  isNew: false,
                  color: "amber",
                },
                {
                  id: 5,
                  title: "Cloud Computing Essentials",
                  description: "Learn to design, deploy, and manage applications in the cloud.",
                  instructor: "Dr. Robert Wilson",
                  level: "Intermediate",
                  duration: "6 weeks",
                  students: 1532,
                  rating: 4.5,
                  image: "/placeholder.svg?height=180&width=320",
                  category: "Networking",
                  isNew: true,
                  color: "sky",
                },
                {
                  id: 6,
                  title: "Cybersecurity Fundamentals",
                  description: "Understand key concepts in network security, cryptography, and threat detection.",
                  instructor: "Prof. Emily Davis",
                  level: "Beginner",
                  duration: "8 weeks",
                  students: 1876,
                  rating: 4.7,
                  image: "/placeholder.svg?height=180&width=320",
                  category: "Cybersecurity",
                  isNew: true,
                  color: "red",
                },
              ].map((course) => (
                <Card key={course.id} className="overflow-hidden flex flex-col course-card border-0 shadow-md">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-b from-${course.color}-600/20 to-${course.color}-600/0 mix-blend-overlay`}
                    ></div>
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full aspect-video object-cover"
                    />
                    {course.isNew && (
                      <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">New</Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge
                        variant="outline"
                        className={`mb-2 bg-${course.color}-50 text-${course.color}-700 border-${course.color}-200 dark:bg-${course.color}-900/30 dark:text-${course.color}-400 dark:border-${course.color}-800`}
                      >
                        {course.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-sm font-medium">{course.instructor}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        <span>{course.level}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/courses/${course.id}`}>Enroll Now</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="mr-2">
                Previous
              </Button>
              <Button variant="outline" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" className="mx-1">
                2
              </Button>
              <Button variant="outline" className="mx-1">
                3
              </Button>
              <Button variant="outline" className="ml-2">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
