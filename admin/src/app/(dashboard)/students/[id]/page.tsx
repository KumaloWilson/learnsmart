"use client"
import StudentDetail from "@/components/students/student-detail"
import { useParams } from "next/navigation"



export default function StudentPage() {


    const params = useParams()
  
    if (!params.id) {
        return null
    }

    const studentId = params.id as string

    if (!studentId) {
        return null
    }

  return <StudentDetail studentId={studentId} />
}
