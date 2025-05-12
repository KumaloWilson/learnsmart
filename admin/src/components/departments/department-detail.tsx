"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDepartments } from "@/hooks/use-departments"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Pencil } from "lucide-react"

interface DepartmentDetailProps {
  id: string
}

export function DepartmentDetail({ id }: DepartmentDetailProps) {
  const router = useRouter()
  const { currentDepartment, loadDepartment, isLoading, error } = useDepartments()

  useEffect(() => {
    loadDepartment(id)
  }, [id, loadDepartment])

  if (isLoading.currentDepartment) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!currentDepartment) {
    return (
      <Alert>
        <AlertDescription>Department not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentDepartment.name}</h1>
          <p className="text-muted-foreground">Code: {currentDepartment.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/departments")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Departments
          </Button>
          <Button size="sm" onClick={() => router.push(`/departments/edit/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Department
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
          <CardDescription>Detailed information about the department</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{currentDepartment.description}</p>
          </div>
          <div>
            <h3 className="font-medium">School</h3>
            <p className="text-sm text-muted-foreground">{currentDepartment.school?.name || "Unknown School"}</p>
          </div>
          <div>
            <h3 className="font-medium">Created</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(currentDepartment.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Last Updated</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(currentDepartment.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programs</CardTitle>
          <CardDescription>Programs within this department</CardDescription>
        </CardHeader>
        <CardContent>
          {currentDepartment.programs && currentDepartment.programs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Duration (Years)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDepartment.programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>{program.code}</TableCell>
                    <TableCell className="capitalize">{program.level}</TableCell>
                    <TableCell>{program.durationYears}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">No programs found for this department.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
