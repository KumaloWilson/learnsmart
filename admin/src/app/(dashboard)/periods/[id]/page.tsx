import { PeriodDetail } from "@/components/periods/period-detail"

interface PeriodPageProps {
  params: {
    id: string
  }
}

export default function PeriodPage({ params }: PeriodPageProps) {
  return <PeriodDetail id={params.id} />
}
