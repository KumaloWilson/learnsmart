"use client"
import { PeriodDetail } from "@/components/periods/period-detail"
import { useParams } from "next/navigation"


export default function PeriodPage() {

    const params = useParams()
  
    const id = params.id as string

  return <PeriodDetail id={id} />
}
