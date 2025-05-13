import { Skeleton } from "@/components/ui/skeleton"

export function AssessmentsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
