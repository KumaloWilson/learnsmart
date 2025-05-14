import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"

export default function ProgressPage() {
  const courseProgress = [
    {
      id: "CS101",
      name: "Introduction to Computer Science",
      completed: 75,
      total: 15,
      done: 12,
      nextTopic: "Advanced Algorithms",
    },
    {
      id: "CS201",
      name: "Data Structures and Algorithms",
      completed: 60,
      total: 12,
      done: 7,
      nextTopic: "Graph Algorithms",
    },
    {
      id: "CS301",
      name: "Database Systems",
      completed: 80,
      total: 10,
      done: 8,
      nextTopic: "Database Optimization",
    },
    {
      id: "CS401",
      name: "Web Development",
      completed: 45,
      total: 14,
      done: 6,
      nextTopic: "Frontend Frameworks",
    },
  ]

  return (
    <PageContainer title="Progress" description="Track course progress and curriculum completion">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="cs101">CS101: Intro to CS</SelectItem>
            <SelectItem value="cs201">CS201: Data Structures</SelectItem>
            <SelectItem value="cs301">CS301: Database Systems</SelectItem>
            <SelectItem value="cs401">CS401: Web Development</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
            <Progress value={65} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">33/51</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Advanced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CS301</div>
            <p className="text-xs text-muted-foreground">80% complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CS401</div>
            <p className="text-xs text-muted-foreground">45% complete</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="courses">Course Progress</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Progress across all active courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="hidden md:table-cell">Topics</TableHead>
                      <TableHead className="hidden md:table-cell">Next Topic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseProgress.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.name}</div>
                            <div className="text-sm text-muted-foreground">{course.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{course.completed}%</span>
                            </div>
                            <Progress value={course.completed} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {course.done}/{course.total} topics
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{course.nextTopic}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curriculum">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Overview</CardTitle>
              <CardDescription>Detailed view of curriculum and topics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Curriculum tree view will be implemented here</p>
                <p className="text-sm mt-2">Showing topics, subtopics, and dependencies</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Progress Timeline</CardTitle>
              <CardDescription>Historical progress and projections</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Progress timeline chart will be implemented here</p>
                <p className="text-sm mt-2">Showing historical progress and projected completion dates</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
