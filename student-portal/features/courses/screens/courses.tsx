import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Courses() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
      <p className="text-muted-foreground">Browse and manage your enrolled courses.</p>
      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Courses content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
