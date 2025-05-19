import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Performance() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
      <p className="text-muted-foreground">Track your academic performance and progress.</p>
      <Card>
        <CardHeader>
          <CardTitle>Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Performance content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
