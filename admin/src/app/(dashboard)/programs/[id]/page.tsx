"use client"
import { ProgramDetail } from "@/components/programs/program-detail"
import { useParams } from "next/navigation"

export default function ProgramPage() {

    const params = useParams()
  
    const id = params.id as string

  return <ProgramDetail id={id} />
}
