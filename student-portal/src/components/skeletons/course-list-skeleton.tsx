import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function CourseListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-video w-full">
            <Skeleton className="h-full w-full" />
          </div>
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t pt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
