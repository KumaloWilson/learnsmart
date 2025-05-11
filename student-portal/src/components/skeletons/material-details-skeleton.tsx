import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function MaterialDetailsSkeleton() {
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
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-6 w-40" />

          <Skeleton className="h-[400px] w-full rounded-md" />

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>

          <div className="mt-6 border-t pt-4">
            <Skeleton className="h-6 w-64 mb-4" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
