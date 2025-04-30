import { PageHeader } from "@/components/page-header"
import { QuizzesTable } from "@/components/quizzes-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function QuizzesPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <PageHeader title="Quizzes" description="Create and manage quizzes for your courses" />
        <Link href="/quizzes/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </Link>
      </div>

      <QuizzesTable />
    </div>
  )
}
