import { Skeleton } from "@/components/ui/skeleton"

export function NotificationsListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-start space-x-4 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
