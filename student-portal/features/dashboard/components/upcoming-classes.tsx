import type { VirtualClass } from "@/features/dashboard/types"
import { VirtualClassCard } from "@/features/virtual-classes/components/virtual-class-card"

interface UpcomingClassesProps {
  classes: VirtualClass[]
}

export function UpcomingClasses({ classes }: UpcomingClassesProps) {
  // Sort classes by start time (earliest first)
  const sortedClasses = [...classes].sort(
    (a, b) => new Date(a.scheduledStartTime).getTime() - new Date(b.scheduledStartTime).getTime(),
  )

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sortedClasses.map((virtualClass) => (
        <VirtualClassCard key={virtualClass.id} virtualClass={virtualClass} showCourse={true} />
      ))}
    </div>
  )
}
