import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CoursesManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Courses Management</h1>
        <p className="text-muted-foreground">Manage courses and course materials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>View and manage courses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Courses management content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
