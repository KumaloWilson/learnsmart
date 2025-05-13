import { CourseDetail } from "@/components/courses/course-detail"

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  return <CourseDetail id={params.id} />
}
