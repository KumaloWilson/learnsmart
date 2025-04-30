import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import { CourseDetails } from "@/components/course-details"
import { CourseStudents } from "@/components/course-students"
import { CourseAssessments } from "@/components/course-assessments"
import { CourseMaterials } from "@/components/course-materials"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <Suspense fallback={<Skeleton className="h-10 w-1/2" />}>
        <CoursePageHeader courseId={params.id} />
      </Suspense>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CourseDetails courseId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CourseStudents courseId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="assessments" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CourseAssessments courseId={params.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
            <CourseMaterials courseId={params.id} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CoursePageHeader({ courseId }: { courseId: string }) {
  // In a real app, fetch course data from API
  // For now, using mock data
  const course = {
    id: courseId,
    code: "CS101",
    name: "Introduction to Computer Science",
    semester: "Spring 2025",
  }

  return <PageHeader title={`${course.code}: ${course.name}`} description={`${course.semester} • Course Details`} />
}
