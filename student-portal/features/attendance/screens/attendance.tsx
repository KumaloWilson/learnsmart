import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Attendance() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
      <p className="text-muted-foreground">Track your attendance records for all courses.</p>
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Attendance content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
