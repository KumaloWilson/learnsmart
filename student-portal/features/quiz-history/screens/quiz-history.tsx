import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuizHistory() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Quiz History</h1>
      <p className="text-muted-foreground">View your past quiz attempts and results.</p>
      <Card>
        <CardHeader>
          <CardTitle>Quiz History</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Quiz History content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
