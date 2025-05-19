import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { MainLayout } from "@/components/layouts/main-layout"
import { CourseDetails } from "@/features/courses/screens/course-details"

export default async function CourseDetailsPage({
  params,
  searchParams,
}: {
  params: { courseId: string }
  searchParams: { semesterId?: string }
}) {
  // Check for auth cookie on the server
  const cookieStore = await cookies()
  const hasAuthCookie = cookieStore.has("accessToken")

  // If no auth cookie, redirect to login
  if (!hasAuthCookie) {
    redirect("/login")
  }

  const { courseId } = params
  const semesterId = searchParams.semesterId

  if (!courseId || !semesterId) {
    redirect("/courses")
  }

  return (
    <MainLayout>
      <CourseDetails courseId={courseId} semesterId={semesterId} />
    </MainLayout>
  )
}