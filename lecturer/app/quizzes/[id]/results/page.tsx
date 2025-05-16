"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, Loader2, Search, SlidersHorizontal, Users } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useQuiz, useQuizStatistics } from "@/lib/auth/hooks"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"

export default function QuizResultsPage() {
  const { id } = useParams()
  const { lecturerProfile } = useAuth()
  const { getQuizById, quiz, isLoading: isLoadingQuiz } = useQuiz()
  const {
    getQuizStatistics,
    getQuizAttempts,
    statistics,
    attempts,
    isLoading: isLoadingStatistics,
  } = useQuizStatistics()
  const [searchTerm, setSearchTerm] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          // Fetch quiz details
          await getQuizById(id as string)

          // Fetch statistics and attempts
          try {
            await getQuizStatistics(id as string)
            await getQuizAttempts(id as string)
          } catch (err) {
            console.error("Error fetching quiz statistics:", err)
          }
        } catch (err) {
          console.error("Error fetching quiz data:", err)
        } finally {
          setIsInitialLoading(false)
        }
      }
    }

    fetchData()
  }, [id, getQuizById, getQuizStatistics, getQuizAttempts])

  const filteredAttempts = attempts.filter(
    (attempt) =>
      attempt.studentProfile.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.studentProfile.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.studentProfile.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExportResults = () => {
    // Implementation for exporting results
    alert("Export functionality will be implemented here")
  }

  if (isInitialLoading || isLoadingQuiz) {
    return (
      <div className="container py-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading quiz results...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <PageContainer title="Quiz Results" description="View quiz results">
        <Alert variant="destructive">
          <AlertDescription>Quiz not found</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" asChild>
            <Link href="/quizzes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
            </Link>
          </Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={`${quiz.title} - Results`} description="View and analyze quiz results">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-2">
          <Link href={`/quizzes/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-semibold">{quiz.title}</h2>
          <p className="text-muted-foreground">Results and analytics</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStatistics ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : statistics ? (
              <>
                <div className="text-2xl font-bold">
                  {statistics.attemptedCount}/{statistics.totalStudents}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((statistics.attemptedCount / statistics.totalStudents) * 100)}% of students
                </p>
              </>
            ) : (
              <div className="text-2xl font-bold">0/0</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStatistics ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : statistics ? (
              <>
                <div className="text-2xl font-bold">{statistics.averageScore}%</div>
                <Progress value={statistics.averageScore} className="h-2 mt-2" />
              </>
            ) : (
              <div className="text-2xl font-bold">0%</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStatistics ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : statistics ? (
              <>
                <div className="text-2xl font-bold">{statistics.passRate}%</div>
                <Progress value={statistics.passRate} className="h-2 mt-2" />
              </>
            ) : (
              <div className="text-2xl font-bold">0%</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Score Range</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStatistics ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Loading...</span>
              </div>
            ) : statistics ? (
              <>
                <div className="text-2xl font-bold">
                  {statistics.lowestScore}% - {statistics.highestScore}%
                </div>
                <p className="text-xs text-muted-foreground">Median: {statistics.medianScore}%</p>
              </>
            ) : (
              <div className="text-2xl font-bold">0% - 0%</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All Attempts</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          </TabsList>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search students..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Highest Score</DropdownMenuItem>
                <DropdownMenuItem>Lowest Score</DropdownMenuItem>
                <DropdownMenuItem>Latest Attempts</DropdownMenuItem>
                <DropdownMenuItem>Earliest Attempts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" onClick={handleExportResults} className="w-full md:w-auto">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          {isLoadingStatistics ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredAttempts.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell>{attempt.studentProfile.studentId}</TableCell>
                        <TableCell>
                          {attempt.studentProfile.user.firstName} {attempt.studentProfile.user.lastName}
                        </TableCell>
                        <TableCell>{formatDate(attempt.startTime)}</TableCell>
                        <TableCell>{attempt.endTime ? formatDate(attempt.endTime) : "In progress"}</TableCell>
                        <TableCell>
                          {attempt.score !== null ? (
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{attempt.score}%</span>
                              <Badge
                                variant={attempt.score >= quiz.passingMarks ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {attempt.score >= quiz.passingMarks ? "Pass" : "Fail"}
                              </Badge>
                            </div>
                          ) : (
                            "Not graded"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              attempt.status === "completed"
                                ? "default"
                                : attempt.status === "in_progress"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {attempt.status === "completed"
                              ? "Completed"
                              : attempt.status === "in_progress"
                                ? "In Progress"
                                : "Abandoned"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/quizzes/${id}/results/${attempt.id}`}>View Details</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-muted-foreground opacity-20 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "No attempts match your search" : "No attempts recorded for this quiz yet"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {isLoadingStatistics ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttempts
                      .filter((attempt) => attempt.status === "completed")
                      .map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell>{attempt.studentProfile.studentId}</TableCell>
                          <TableCell>
                            {attempt.studentProfile.user.firstName} {attempt.studentProfile.user.lastName}
                          </TableCell>
                          <TableCell>{formatDate(attempt.startTime)}</TableCell>
                          <TableCell>{formatDate(attempt.endTime)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className="font-medium mr-2">{attempt.score}%</span>
                              <Badge
                                variant={attempt.score >= quiz.passingMarks ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {attempt.score >= quiz.passingMarks ? "Pass" : "Fail"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">Completed</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/quizzes/${id}/results/${attempt.id}`}>View Details</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          {isLoadingStatistics ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttempts
                      .filter((attempt) => attempt.status === "in_progress")
                      .map((attempt) => (
                        <TableRow key={attempt.id}>
                          <TableCell>{attempt.studentProfile.studentId}</TableCell>
                          <TableCell>
                            {attempt.studentProfile.user.firstName} {attempt.studentProfile.user.lastName}
                          </TableCell>
                          <TableCell>{formatDate(attempt.startTime)}</TableCell>
                          <TableCell>
                            {attempt.startTime
                              ? `${Math.round(
                                  (new Date().getTime() - new Date(attempt.startTime).getTime()) / (1000 * 60),
                                )} mins`
                              : "Unknown"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">In Progress</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" disabled>
                              Not Available
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
