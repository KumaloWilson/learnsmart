import { ProgramDetail } from "@/components/programs/program-detail"

interface ProgramPageProps {
  params: {
    id: string
  }
}

export default function ProgramPage({ params }: ProgramPageProps) {
  return <ProgramDetail id={params.id} />
}
