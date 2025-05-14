"use client"

import { useEffect, useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Search, Loader2, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth/auth-context"
import { useQuizzes, useCourses } from "@/lib/auth/hooks"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatDateShort } from "@/lib/utils"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateQuizDialog } from "@/components/create-quiz-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function QuizzesPage() {
  const { lecturerProfile } = useAuth()
  const { getQuizzesByFilters, quizzes, isLoading, error } = useQuizzes()
  const { getCourses, courses, isLoading: isLoadingCourses } = useCourses()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (lecturerProfile?.id) {
        try {
          // Fetch courses for the filter dropdown
          await getCourses(lecturerProfile.id)

          // Fetch quizzes
          await getQuizzesByFilters({ lecturerProfileId: lecturerProfile.id })
        } catch (err) {
          console.error("Error fetching data:", err)
        } finally {
          setIsInitialLoading(false)
        }
      } else {
        setIsInitialLoading(false)
      }
    }

    fetchData()
  }, [lecturerProfile, getQuizzesByFilters, getCourses])

  const handleCourseChange = async (courseId: string) => {
    setSelectedCourse(courseId)
    if (lecturerProfile?.id) {
      try {
        if (courseId === "all") {
          await getQuizzesByFilters({ lecturerProfileId: lecturerProfile.id })
        } else {
          await getQuizzesByFilters({
            lecturerProfileId: lecturerProfile.id,
            courseId: courseId,
          })
        }
      } catch (err) {
        console.error("Error filtering quizzes:", err)
      }
    }
  }

  const handleSearch = async () => {
    if (lecturerProfile?.id) {
      try {
        const filters: any = { lecturerProfileId: lecturerProfile.id }

        if (searchTerm) {
          filters.search = searchTerm
        }

        if (selectedCourse !== "all") {
          filters.courseId = selectedCourse
        }

        await getQuizzesByFilters(filters)
      } catch (err) {
        console.error("Error searching quizzes:", err)
      }
    }
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeQuizzes = filteredQuizzes.filter((quiz) => quiz.isActive)
  const inactiveQuizzes = filteredQuizzes.filter((quiz) => !quiz.isActive)

  const isQuizActive = (quiz: any) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    const endDate = new Date(quiz.endDate)
    return now >= startDate && now <= endDate && quiz.isActive
  }

  const isQuizUpcoming = (quiz: any) => {
    const now = new Date()
    const startDate = new Date(quiz.startDate)
    return now < startDate && quiz.isActive
  }

  const isQuizExpired = (quiz: any) => {
    const now = new Date()
    const endDate = new Date(quiz.endDate)
    return now > endDate || !quiz.isActive
  }

  const getQuizStatusBadge = (quiz: any) => {
    if (isQuizActive(quiz)) {
      return <Badge variant="default">Active</Badge>
    } else if (isQuizUpcoming(quiz)) {
      return <Badge variant="outline">Upcoming</Badge>
    } else if (isQuizExpired(quiz)) {
      return <Badge variant="secondary">Expired</Badge>
    } else {
      return <Badge variant="destructive">Inactive</Badge>
    }
  }

  if (isInitialLoading) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <PageContainer title="Quizzes" description="Create and manage quizzes for your courses">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Quizzes" description="Create and manage quizzes for your courses">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          <Select value={selectedCourse} onValueChange={handleCourseChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.courseCode} - {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full md:w-auto" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Quiz
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="all">All Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="hidden md:table-cell">Topic</TableHead>
                    <TableHead className="hidden md:table-cell">Questions</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Dates</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeQuizzes.length > 0 ? (
                    activeQuizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz.course?.code || "N/A"}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.topic}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.numberOfQuestions}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.timeLimit} mins</TableCell>
                        <TableCell>{getQuizStatusBadge(quiz)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <div className="flex items-center text-xs">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>Start: {formatDateShort(quiz.startDate)}</span>
                            </div>
                            <div className="flex items-center text-xs mt-1">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>End: {formatDateShort(quiz.endDate)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}/edit`}>Edit Quiz</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}/results`}>View Results</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">Deactivate Quiz</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No active quizzes match your search" : "No active quizzes found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="hidden md:table-cell">Topic</TableHead>
                    <TableHead className="hidden md:table-cell">Questions</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Dates</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveQuizzes.length > 0 ? (
                    inactiveQuizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz.course?.code || "N/A"}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.topic}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.numberOfQuestions}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.timeLimit} mins</TableCell>
                        <TableCell>{getQuizStatusBadge(quiz)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <div className="flex items-center text-xs">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>Start: {formatDateShort(quiz.startDate)}</span>
                            </div>
                            <div className="flex items-center text-xs mt-1">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>End: {formatDateShort(quiz.endDate)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}/edit`}>Edit Quiz</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}/results`}>View Results</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Activate Quiz</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete Quiz</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No inactive quizzes match your search" : "No inactive quizzes found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead className="hidden md:table-cell">Topic</TableHead>
                    <TableHead className="hidden md:table-cell">Questions</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Dates</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizzes.length > 0 ? (
                    filteredQuizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{quiz.course?.code || "N/A"}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.topic}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.numberOfQuestions}</TableCell>
                        <TableCell className="hidden md:table-cell">{quiz.timeLimit} mins</TableCell>
                        <TableCell>{getQuizStatusBadge(quiz)}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col">
                            <div className="flex items-center text-xs">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>Start: {formatDateShort(quiz.startDate)}</span>
                            </div>
                            <div className="flex items-center text-xs mt-1">
                              <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span>End: {formatDateShort(quiz.endDate)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}`}>View Details</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}/edit`}>Edit Quiz</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/quizzes/${quiz.id}/results`}>View Results</Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {quiz.isActive ? (
                                <DropdownMenuItem className="text-destructive">Deactivate Quiz</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Activate Quiz</DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">Delete Quiz</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No quizzes match your search" : "No quizzes found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateQuizDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        lecturerId={lecturerProfile?.id || ""}
      />
    </PageContainer>
  )
}
