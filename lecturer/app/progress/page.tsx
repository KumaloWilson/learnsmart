"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourses } from "@/lib/auth/hooks"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { TopicProgressStatistics } from "@/components/topic-progress-statistics"
import { StudentMasteryTable } from "@/components/student-mastery-table"
import { CourseMasteryStatistics } from "@/components/course-mastery-statistics"

export default function ProgressPage() {
  const { lecturerProfile } = useAuth()
  const { courses, getCourses, isLoading: coursesLoading } = useCourses()
  const [selectedCourseId, setSelectedCourseId] = useState<string>("")
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("")
  const [activeTab, setActiveTab] = useState("topics")

  useEffect(() => {
    if (lecturerProfile?.id) {
      getCourses(lecturerProfile.id)
    }
  }, [lecturerProfile, getCourses])

  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].courseId)
      setSelectedSemesterId(courses[0].semesterId)
    }
  }, [courses, selectedCourseId])

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId)
    const course = courses.find((c) => c.courseId === courseId)
    if (course) {
      setSelectedSemesterId(course.semesterId)
    }
  }

  if (coursesLoading) {
    return (
      <PageContainer title="Course Progress" loading={true}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (!courses || courses.length === 0) {
    return (
      <PageContainer title="Course Progress">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium">No courses found</h3>
              <p className="text-muted-foreground mt-2">
                You don't have any courses assigned to you. Please contact your administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Course Progress" description="Track student progress and mastery across your courses">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Selection</CardTitle>
            <CardDescription>Select a course to view progress data</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCourseId} onValueChange={handleCourseChange}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.courseId} value={course.courseId}>
                    {course.courseName} ({course.courseCode}) - {course.semesterName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCourseId && selectedSemesterId && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="topics">Topic Progress</TabsTrigger>
              <TabsTrigger value="mastery">Mastery Statistics</TabsTrigger>
              <TabsTrigger value="students">Student Masteries</TabsTrigger>
            </TabsList>
            <TabsContent value="topics" className="mt-6">
              <TopicProgressStatistics courseId={selectedCourseId} semesterId={selectedSemesterId} />
            </TabsContent>
            <TabsContent value="mastery" className="mt-6">
              <CourseMasteryStatistics courseId={selectedCourseId} semesterId={selectedSemesterId} />
            </TabsContent>
            <TabsContent value="students" className="mt-6">
              <StudentMasteryTable courseId={selectedCourseId} semesterId={selectedSemesterId} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageContainer>
  )
}
