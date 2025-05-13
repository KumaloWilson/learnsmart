"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSchools } from "@/hooks/use-schools"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Pencil, Plus } from "lucide-react"

interface SchoolDetailProps {
  id: string
}

export function SchoolDetail({ id }: SchoolDetailProps) {
  const router = useRouter()
  const { currentSchool, loadSchool, isLoading, error } = useSchools()

  useEffect(() => {
    loadSchool(id)
  }, [id, loadSchool])

  if (isLoading.currentSchool) {
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

  if (!currentSchool) {
    return (
      <Alert>
        <AlertDescription>School not found</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentSchool.name}</h1>
          <p className="text-muted-foreground">Code: {currentSchool.code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push("/school")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schools
          </Button>
          <Button size="sm" onClick={() => router.push(`/school/edit/${id}`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit School
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>Detailed information about the school</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{currentSchool.description}</p>
          </div>
          <div>
            <h3 className="font-medium">Created</h3>
            <p className="text-sm text-muted-foreground">{new Date(currentSchool.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-medium">Last Updated</h3>
            <p className="text-sm text-muted-foreground">{new Date(currentSchool.updatedAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Departments</CardTitle>
            <CardDescription>Departments within this school</CardDescription>
          </div>
          <Button size="sm" onClick={() => router.push(`/departments/create?schoolId=${id}`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </CardHeader>
        <CardContent>
          {currentSchool.departments && currentSchool.departments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSchool.departments.map((department) => (
                  <TableRow
                    key={department.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/departments/${department.id}`)}
                  >
                    <TableCell className="font-medium">{department.name}</TableCell>
                    <TableCell>{department.code}</TableCell>
                    <TableCell className="max-w-md truncate">{department.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-6 text-muted-foreground">No departments found for this school.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
