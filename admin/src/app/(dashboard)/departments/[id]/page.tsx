"use client"

import { DepartmentDetail } from "@/components/departments/department-detail"
import { useParams } from "next/navigation"

export default function DepartmentPage() {

    const params = useParams()
  
    const id = params.id as string

  return <DepartmentDetail id={id} />
}
