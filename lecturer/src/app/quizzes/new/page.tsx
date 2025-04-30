import { PageHeader } from "@/components/page-header"
import { QuizForm } from "@/components/quiz-form"

export default function NewQuizPage() {
  return (
    <div className="container space-y-6 p-6 pb-16">
      <PageHeader title="Create New Quiz" description="Design a new assessment for your students" />

      <QuizForm />
    </div>
  )
}
