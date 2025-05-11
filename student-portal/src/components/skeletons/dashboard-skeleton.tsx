import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-full max-w-[180px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Assessments */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[250px]" />
                    <Skeleton className="h-3 w-full max-w-[200px]" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-6 w-36" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[300px]" />
                    <Skeleton className="h-3 w-full max-w-[250px]" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-2 w-full max-w-[180px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Materials */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[250px]" />
                    <Skeleton className="h-3 w-full max-w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full max-w-[300px]" />
                    <div className="flex items-center gap-2 mt-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-3 w-full max-w-[250px]" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Mastery Overview */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-3">
            <CardTitle>
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
