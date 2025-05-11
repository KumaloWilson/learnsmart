import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PerformanceOverviewSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="mt-8">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  )
}
