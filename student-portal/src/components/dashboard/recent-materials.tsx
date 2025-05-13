"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { getStudentDashboard } from "@/lib/api/student-portal-api"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight, FileText, Video, LinkIcon, FileQuestion } from "lucide-react"

export function RecentMaterials() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!user?.studentProfileId) return

      try {
        const dashboardData = await getStudentDashboard(user.studentProfileId)
        setMaterials(dashboardData.recentMaterials || [])
      } catch (error) {
        console.error("Error fetching recent materials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMaterials()
  }, [user?.studentProfileId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Materials</CardTitle>
          <CardDescription>Recently added learning materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Materials</CardTitle>
          <CardDescription>Recently added learning materials</CardDescription>
        </div>
        <Link href="/materials" className="ml-auto">
          <Button variant="ghost" size="sm" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {materials.length === 0 ? (
          <div className="flex h-[140px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No recent materials</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">No learning materials have been added recently.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {getMaterialIcon(material.type)}
                </div>
                <div className="grid gap-1">
                  <Link href={`/materials/${material.id}`}>
                    <h3 className="font-semibold hover:underline">{material.title}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{material.course?.name}</p>
                    <Badge variant="outline">
                      {formatDistanceToNow(new Date(material.createdAt), { addSuffix: true })}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getMaterialIcon(type: string) {
  switch (type?.toLowerCase()) {
    case "video":
      return <Video className="h-5 w-5 text-primary" />
    case "link":
      return <LinkIcon className="h-5 w-5 text-primary" />
    case "quiz":
      return <FileQuestion className="h-5 w-5 text-primary" />
    case "document":
    default:
      return <FileText className="h-5 w-5 text-primary" />
  }
}
