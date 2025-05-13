"use client"

import { CourseDetail } from "@/components/courses/course-detail"
import { useParams } from "next/navigation"


export default function CoursePage() {
  const params = useParams()

  const id = params.id as string
  
  return <CourseDetail id={id} />
}