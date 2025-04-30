"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { lecturerService } from "@/lib/api-services"

interface EngagementData {
  courseCode: string
  attendance: number
  participation: number
  assignments: number
  quizzes: number
}

export function StudentEngagementChart() {
  const [data, setData] = useState<EngagementData[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchEngagementData = async () => {
      if (!user?.id) return

      try {
        const lecturerProfile = await lecturerService.getLecturerProfile(user.id)
        const engagementData = await lecturerService.getStudentEngagement(lecturerProfile.id)
        setData(engagementData)
      } catch (error) {
        console.error("Failed to fetch engagement data:", error)
        toast({
          title: "Error",
          description: "Failed to load student engagement data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEngagementData()
  }, [user, toast])

  if (loading) {
    return <Skeleton className="h-full w-full" />
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="courseCode" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Card className="p-3 shadow-lg border">
                  <p className="font-medium">{label}</p>
                  {payload.map((entry, index) => (
                    <div key={`item-${index}`} className="flex items-center justify-between gap-2">
                      <span style={{ color: entry.color }}>{entry.name}:</span>
                      <span className="font-medium">{entry.value}%</span>
                    </div>
                  ))}
                </Card>
              )
            }
            return null
          }}
        />
        <Legend />
        <Bar dataKey="attendance" name="Attendance" fill="#4f46e5" />
        <Bar dataKey="participation" name="Participation" fill="#10b981" />
        <Bar dataKey="assignments" name="Assignments" fill="#f59e0b" />
        <Bar dataKey="quizzes" name="Quizzes" fill="#ef4444" />
      </BarChart>
    </ResponsiveContainer>
  )
}
