import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function CourseDetailsSkeleton() {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-2/3">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-8 w-[250px]" />
                  <Skeleton className="h-4 w-[150px] mt-2" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                </div>

                <Skeleton className="h-8 w-full mt-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/3">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24 mt-2" />
                  <Skeleton className="h-4 w-40 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
