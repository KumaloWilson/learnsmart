"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCourseTopics, useTopicProgressStatistics, useCourse, useDeleteCourseTopic } from "@/lib/auth/hooks"
import { PageContainer } from "@/components/page-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Breadcrumb } from "@/components/breadcrumb"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Plus, Search, MoreHorizontal, Edit, Trash, Clock, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function CourseTopicsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = params.courseId as string

  const { course, loading: courseLoading } = useCourse(courseId)
  const {
    topics,
    loading: topicsLoading,
    error: topicsError,
    refetch: refetchTopics,
  } = useCourseTopics(courseId, course?.semesterId || "")
  const {
    progressStats,
    loading: progressLoading,
    refetch: refetchProgress,
  } = useTopicProgressStatistics(courseId, course?.semesterId || "")
  const { deleteTopic, loading: deleteLoading } = useDeleteCourseTopic()

  const [searchTerm, setSearchTerm] = useState("")
  const [topicToDelete, setTopicToDelete] = useState<string | null>(null)

  useEffect(() => {
    if (courseId && course?.semesterId) {
      refetchTopics()
      refetchProgress()
    }
  }, [courseId, course, refetchTopics, refetchProgress])

  const loading = courseLoading || topicsLoading || progressLoading

  const handleDeleteTopic = async () => {
    if (!topicToDelete) return

    const success = await deleteTopic(topicToDelete)
    if (success) {
      toast({
        title: "Topic deleted",
        description: "The course topic has been successfully deleted.",
      })
      refetchTopics()
    } else {
      toast({
        title: "Error",
        description: "Failed to delete the course topic. Please try again.",
        variant: "destructive",
      })
    }
    setTopicToDelete(null)
  }

  const getTopicProgress = (topicId: string) => {
    if (!progressStats) return null
    return progressStats.find((stat) => stat.topicId === topicId)
  }

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Sort topics by orderIndex
  const sortedTopics = [...filteredTopics].sort((a, b) => a.orderIndex - b.orderIndex)

  if (loading) {
    return (
      <PageContainer title="Course Topics" loading={true}>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </PageContainer>
    )
  }

  if (topicsError) {
    return (
      <PageContainer title="Course Topics">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load course topics. Please try again later.</p>
            <Button variant="outline" onClick={() => router.push(`/courses/${courseId}`)} className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`Topics: ${course?.courseName || "Course"}`}
      description="Manage course topics and learning objectives"
      backButton={
        <Button variant="outline" size="sm" onClick={() => router.push(`/courses/${courseId}`)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
      }
      actions={
        <Button onClick={() => router.push(`/courses/${courseId}/topics/create`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Topic
        </Button>
      }
    >
      <Breadcrumb
        items={[
          { label: "Courses", href: "/courses" },
          { label: course?.courseName || "Course", href: `/courses/${courseId}` },
          { label: "Topics" },
        ]}
        className="mb-4"
      />

      <Card>
        <CardHeader>
          <CardTitle>Course Topics</CardTitle>
          <CardDescription>Manage topics and track student progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search topics..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {sortedTopics.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No topics found for this course.</p>
              <Button onClick={() => router.push(`/courses/${courseId}/topics/create`)} className="mt-4">
                Create First Topic
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Difficulty</TableHead>
                    <TableHead className="hidden md:table-cell">Duration</TableHead>
                    <TableHead className="hidden lg:table-cell">Progress</TableHead>
                    <TableHead className="hidden lg:table-cell">Mastery</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTopics.map((topic) => {
                    const progress = getTopicProgress(topic.id)

                    return (
                      <TableRow key={topic.id} className="hover:bg-muted/50">
                        <TableCell>{topic.orderIndex}</TableCell>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{topic.title}</span>
                            <span className="text-xs text-muted-foreground hidden md:inline-block">
                              {topic.description.length > 50
                                ? `${topic.description.substring(0, 50)}...`
                                : topic.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{topic.difficulty}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{topic.durationHours} hours</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {progress ? (
                            <div className="flex items-center gap-2">
                              <Progress value={progress.completionRate * 100} className="h-2 w-24" />
                              <span className="text-xs">{Math.round(progress.completionRate * 100)}%</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No data</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {progress ? (
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{Math.round(progress.averageMasteryLevel * 100)}%</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No data</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant={topic.isActive ? "default" : "secondary"}>
                            {topic.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => router.push(`/courses/${courseId}/topics/${topic.id}`)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Topic
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setTopicToDelete(topic.id)}>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete Topic
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!topicToDelete} onOpenChange={(open) => !open && setTopicToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the topic and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTopic} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  )
}
