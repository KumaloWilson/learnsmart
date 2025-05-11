import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function QuizzesListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t pt-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
