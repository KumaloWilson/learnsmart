"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartLegend,
} from "@/components/ui/chart"
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip,
  TooltipProps 
} from "recharts"
import type { PerformanceData } from "@/features/performance/types"
import { ReactElement } from "react"
import { ChartTooltipContent, ChartTooltipItem } from "@/components/ui/chart"

interface PerformanceChartProps {
  performanceData: PerformanceData
}

interface BarDataItem {
  name: string;
  value: number;
  fill: string;
}

export function PerformanceChart({ performanceData }: PerformanceChartProps) {
  const data = [
    {
      name: "Attendance",
      value: performanceData.attendancePercentage,
      fill: "#4ade80", // green
    },
    {
      name: "Assignments",
      value: performanceData.assignmentAverage,
      fill: "#60a5fa", // blue
    },
    {
      name: "Quizzes",
      value: performanceData.quizAverage,
      fill: "#f97316", // orange
    },
    {
      name: "Overall",
      value: performanceData.overallPerformance,
      fill: "#8b5cf6", // purple
    },
  ]

  // Custom tooltip renderer with proper typing
  const renderTooltipContent = (props: TooltipProps<number, string>): ReactElement | null => {
    const { active, payload } = props;
    
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    
    return (
      <ChartTooltipContent
        items={() => 
          payload.map((entry) => (
            <ChartTooltipItem
              key={entry.name}
              label={entry.name as string}
              value={`${entry.value}%`}
              color={(entry.payload as BarDataItem).fill}
            />
          ))
        }
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Your performance in {performanceData.course.name} ({performanceData.course.code})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer>
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={renderTooltipContent} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
            <ChartLegend 
              items={data.map(item => ({ name: item.name, color: item.fill }))}
            />
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}