import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { VirtualClass } from "@/features/courses/types"
import { VirtualClassCard } from "@/features/virtual-classes/components/virtual-class-card"

interface CourseVirtualClassesProps {
  virtualClasses: VirtualClass[]
}

export function CourseVirtualClasses({ virtualClasses }: CourseVirtualClassesProps) {
  if (!virtualClasses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Virtual Classes</CardTitle>
          <CardDescription>No virtual classes scheduled for this course yet.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  // Sort classes by start time (upcoming first, then past)
  const now = new Date()
  const sortedClasses = [...virtualClasses].sort((a, b) => {
    const aDate = new Date(a.scheduledStartTime)
    const bDate = new Date(b.scheduledStartTime)
    const aIsPast = aDate < now
    const bIsPast = bDate < now

    if (aIsPast && !bIsPast) return 1
    if (!aIsPast && bIsPast) return -1
    return aDate.getTime() - bDate.getTime()
  })

  return (
    <div className="space-y-4">
      {sortedClasses.map((virtualClass) => (
        <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} />
      ))}
    </div>
  )
}
