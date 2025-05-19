"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { useAuth } from "@/lib/auth/auth-context"
import { useCourseDetail, useCourseTopics } from "@/lib/auth/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Plus, FileEdit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function CourseTopicsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { lecturerProfile } = useAuth()
  const lecturerId = lecturerProfile?.id || ""

  // Default semester ID to use until we get the course details
  const defaultSemesterId = "bbfc180e-11ce-48a5-adb6-95b197339bae"
  const [semesterId, setSemesterId] = useState(defaultSemesterId)
  
  // Add state to track API errors and prevent endless loading
  const [apiError, setApiError] = useState(false)

  // Use the new API endpoint to get detailed course information
  const {
    courseDetail,
    isLoading: courseLoading,
    error: courseError,
    // refetch: refetchCourse,
  } = useCourseDetail(lecturerId, courseId, semesterId)

  console.log("courseDetail", courseDetail)

  // Update semesterId if we get it from courseDetail
  useEffect(() => {
    if (courseDetail?.semester?.id) {
      setSemesterId(courseDetail.semester.id)
    }
  }, [courseDetail])

  // Fetch topics once we have the semester ID
  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
    // refetch: refetchTopics,
  } = useCourseTopics(courseId, semesterId)


  // Error handling - set API error flag if either API returns an error
  useEffect(() => {
    if (courseError || topicsError) {
      setApiError(true)
    }
  }, [courseError, topicsError])

  // If we're in an error state, stop showing loading
  const isLoading = !apiError && (courseLoading || topicsLoading)

  // Render error state if there's an API error
  if (apiError) {
    return (
      <PageContainer title="Course Topics">
        <div className="py-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error loading course data</h2>
          <p className="text-muted-foreground mb-4">
            {courseError || topicsError || "Unable to load course information. Please try again later."}
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push("/courses")}>Return to Courses</Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setApiError(false);
                // refetchCourse();
                // refetchTopics();
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <PageContainer title="Course Topics" loading={true}>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  // No course data found
  if (!courseDetail || !courseDetail.course) {
    return (
      <PageContainer title="Course Topics">
        <div className="py-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Course not found</h2>
          <p className="text-muted-foreground mb-4">The requested course information could not be found</p>
          <Button onClick={() => router.push("/courses")}>Return to Courses</Button>
        </div>
      </PageContainer>
    )
  }

  const { course } = courseDetail

  return (
    <PageContainer title={`Topics - ${course.name}`} description={`Course Code: ${course.code}`}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.push(`/courses/${courseId}`)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>
          <Link href={`/courses/${courseId}/topics/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Topic
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Topics</CardTitle>
          </CardHeader>
          <CardContent>
            {!topics || topics.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No topics have been added to this course yet.</p>
                <Link href={`/courses/${courseId}/topics/create`}>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Topic
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell className="font-medium">{topic.title}</TableCell>
                      <TableCell>{topic.description?.substring(0, 100) || "No description"}...</TableCell>
                      <TableCell>{topic.orderIndex}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            topic.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {topic.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/courses/${courseId}/topics/${topic.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/courses/${courseId}/topics/${topic.id}/edit`)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}