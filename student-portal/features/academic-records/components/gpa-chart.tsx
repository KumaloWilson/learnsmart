"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  ChartTooltipItem,
} from "@/components/ui/chart"
import { 
  Line, 
  LineChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  TooltipProps 
} from "recharts"
import type { AcademicRecord } from "@/features/academic-records/types"
import { ReactElement } from "react"

interface GPAChartProps {
  records: AcademicRecord[]
}

interface LinePayloadItem {
  value: number;
  name: string;
  stroke: string;
  dataKey: string;
}

export function GPAChart({ records }: GPAChartProps) {
  // Sort records by semester date
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.semester.startDate).getTime() - new Date(b.semester.startDate).getTime(),
  )

  const data = sortedRecords.map((record) => ({
    name: record.semester.name,
    gpa: record.gpa,
    cgpa: record.cgpa,
  }))

  // Render custom tooltip content
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
              key={entry.dataKey}
              label={entry.dataKey === "gpa" ? "GPA" : "CGPA"}
              value={(entry.value as number).toFixed(2)}
              color={entry.stroke!}
            />
          ))
        }
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GPA Trend</CardTitle>
        <CardDescription>Your GPA and CGPA across semesters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer>
            <Chart>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={data}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 4]} />
                  <Tooltip content={renderTooltipContent} />
                  <Line type="monotone" dataKey="gpa" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="cgpa" stroke="#60a5fa" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Chart>
            <ChartLegend
              items={[
                { name: "GPA", color: "#8b5cf6" },
                { name: "CGPA", color: "#60a5fa" },
              ]}
            />
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}