import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CourseMaterials() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Course Materials</h1>
      <p className="text-muted-foreground">Access your course materials and resources.</p>
      <Card>
        <CardHeader>
          <CardTitle>Course Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Course Materials content will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
