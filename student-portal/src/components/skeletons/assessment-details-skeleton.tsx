import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AssessmentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[150px] mt-2" />
            </div>
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
