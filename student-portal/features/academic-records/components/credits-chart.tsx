"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Chart,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
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
import type { AcademicRecord } from "@/features/academic-records/types"
import { ReactElement } from "react"

interface CreditsChartProps {
  records: AcademicRecord[]
}

// Define proper types for the tooltip payload
interface BarPayloadItem {
  value: number;
  name: string;
  fill: string;
  dataKey: string;
}

export function CreditsChart({ records }: CreditsChartProps) {
  // Sort records by semester date
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.semester.startDate).getTime() - new Date(b.semester.startDate).getTime(),
  )

  const data = sortedRecords.map((record) => ({
    name: record.semester.name,
    earned: record.earnedCredits,
    total: record.totalCredits,
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
              label={entry.dataKey === "earned" ? "Earned Credits" : "Total Credits"}
              value={entry.toString()}
              color={entry.color!}
            />
          ))
        }
      />
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits Progress</CardTitle>
        <CardDescription>Your earned credits across semesters</CardDescription>
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
                  <YAxis />
                  <Tooltip content={renderTooltipContent} />
                  <Bar dataKey="earned" fill="#4ade80" radius={[4, 4, 0, 0]} name="Earned Credits" />
                  <Bar dataKey="total" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Total Credits" />
                </BarChart>
              </ResponsiveContainer>
            </Chart>
            <ChartLegend
              items={[
                { name: "Earned Credits", color: "#4ade80" },
                { name: "Total Credits", color: "#d1d5db" },
              ]}
            />
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}