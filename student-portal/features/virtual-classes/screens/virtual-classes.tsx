"use client"

import { useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { fetchVirtualClasses } from "@/features/virtual-classes/redux/virtualClassesSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Video, Calendar, Clock, AlertTriangle } from "lucide-react"
import { VirtualClassCard } from "@/features/virtual-classes/components/virtual-class-card"

export function VirtualClasses() {
  const dispatch = useAppDispatch()
  const { studentProfile, accessToken } = useAppSelector((state) => state.auth)
  const { virtualClasses, isLoading, error } = useAppSelector((state) => state.virtualClasses)

  useEffect(() => {
    if (studentProfile?.id && accessToken) {
      dispatch(
        fetchVirtualClasses({
          studentProfileId: studentProfile.id,
          token: accessToken,
        }),
      )
    }
  }, [dispatch, studentProfile?.id, accessToken])

  if (isLoading) {
    return <VirtualClassesSkeletonLoader />
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!virtualClasses.length) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Virtual Classes</h1>
          <p className="text-muted-foreground">Join live virtual classes and access recordings for your courses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>No Virtual Classes</CardTitle>
            <CardDescription>You don't have any virtual classes scheduled at this time.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Categorize classes
  const now = new Date()
  const joinableClasses = virtualClasses.filter((vc) => {
    const startDate = new Date(vc.scheduledStartTime)
    const endDate = new Date(vc.scheduledEndTime)
    const minutesBeforeStart = Math.floor((startDate.getTime() - now.getTime()) / (1000 * 60))

    return (minutesBeforeStart <= 5 && minutesBeforeStart >= 0) || (now >= startDate && now <= endDate)
  })

  const upcomingClasses = virtualClasses
    .filter((vc) => {
      const startDate = new Date(vc.scheduledStartTime)
      const minutesBeforeStart = Math.floor((startDate.getTime() - now.getTime()) / (1000 * 60))

      return minutesBeforeStart > 5
    })
    .sort((a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime())

  const pastClasses = virtualClasses
    .filter((vc) => {
      const endDate = new Date(vc.scheduledEndTime)
      return now > endDate
    })
    .sort((a, b) => new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime())

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Virtual Classes</h1>
        <p className="text-muted-foreground">Join live virtual classes and access recordings for your courses</p>
      </div>

      {joinableClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span>Joinable Now</span>
          </h2>
          <div className="space-y-4">
            {joinableClasses.map((virtualClass) => (
              <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} showCourse={true} />
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Upcoming ({upcomingClasses.length})</span>
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Past ({pastClasses.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingClasses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>No upcoming virtual classes at this time.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingClasses.map((virtualClass) => (
                <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} showCourse={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastClasses.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Past Classes</CardTitle>
                <CardDescription>No past virtual classes available.</CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastClasses.map((virtualClass) => (
                <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} showCourse={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VirtualClassesSkeletonLoader() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-96" />
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-32 ml-auto" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
