import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProgramsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Programs Management</h1>
        <p className="text-muted-foreground">Manage academic programs and degrees</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Programs</CardTitle>
          <CardDescription>View and manage academic programs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Programs management content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
