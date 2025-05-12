import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SemestersManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Semesters Management</h1>
        <p className="text-muted-foreground">Manage academic semesters and terms</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semesters</CardTitle>
          <CardDescription>View and manage academic semesters</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Semesters management content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
