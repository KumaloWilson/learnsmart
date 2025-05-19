"use client"

import { SemesterDetail } from "@/components/semesters/semester-detail"
import { useParams } from "next/navigation"

export default function SemesterPage() {

    const params = useParams()
  
    const id = params.id as string


  return <SemesterDetail id={id} />
}
