import { formatDistanceToNow } from "date-fns"
import { UserCircle, BookOpen, FileText } from "lucide-react"

interface Activity {
  id: string
  type: string
  description: string
  timestamp: string
  userId: string
  userName: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities.length) {
    return <p className="text-gray-500">No recent activity to display.</p>
  }

  // Sort activities by timestamp (newest first)
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <div className="space-y-4">
      {sortedActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
        >
          <div className="rounded-full bg-indigo-50 p-2">
            {activity.type === "user" ? (
              <UserCircle className="h-5 w-5 text-indigo-600" />
            ) : activity.type === "enrollment" ? (
              <BookOpen className="h-5 w-5 text-green-600" />
            ) : (
              <FileText className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{activity.userName}</p>
            <p className="text-sm text-gray-600">{activity.description}</p>
            <p className="mt-1 text-xs text-gray-500">
              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
