import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"

export default function PerformanceAnalyticsPage() {
  return (
    <PageContainer title="Performance Analytics" description="Track and analyze student performance">
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

        <Select defaultValue="semester">
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semester">Current Semester</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Academic Year</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="ml-auto gap-2">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+2% from last semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">-1% from last semester</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">CS101</div>
            <p className="text-xs text-muted-foreground">Avg. grade: 85%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Below 60% performance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Aggregate performance metrics across all courses</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Performance charts and visualizations will be implemented here</p>
                <p className="text-sm mt-2">Showing grade distributions, trends, and comparisons</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Performance metrics broken down by course</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Course performance comparison charts will be implemented here</p>
                <p className="text-sm mt-2">Showing performance metrics for each course</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>Individual student performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Student performance charts will be implemented here</p>
                <p className="text-sm mt-2">Showing individual student performance and comparisons</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Performance</CardTitle>
              <CardDescription>Performance metrics for different assessments</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Assessment performance charts will be implemented here</p>
                <p className="text-sm mt-2">Showing performance metrics for quizzes, exams, and assignments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}
