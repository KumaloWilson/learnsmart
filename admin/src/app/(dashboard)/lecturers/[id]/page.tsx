"use client"

import { LecturerDetail } from "@/components/lecturers/lecturer-detail"
import { useParams } from "next/navigation"


export default function LecturerPage() {

    const params = useParams()
  
    const id = params.id as string

  return <LecturerDetail id={id} />
}
