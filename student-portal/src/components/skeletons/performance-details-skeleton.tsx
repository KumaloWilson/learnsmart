import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function PerformanceDetailsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <Skeleton className="h-4 w-24" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <Skeleton className="h-4 w-24" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <Skeleton className="h-4 w-24" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <Skeleton className="h-4 w-24" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <Skeleton className="h-4 w-24" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-32" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-24" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-4 w-16" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Skeleton className="h-6 w-24" />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
