import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface CourseEnrollmentChartProps {
  data: Array<{
    name: string
    total: number
  }>
}

export function CourseEnrollmentChart({ data }: CourseEnrollmentChartProps) {
  // Limit the data to top 5 courses for better display
  const displayData = data.slice(0, 5)
  
  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={displayData}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            // Truncate long course names
            tickFormatter={(value) => value.length > 20 ? `${value.substring(0, 20)}...` : value}
          />
          <YAxis 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}`} 
          />
          <Tooltip 
            formatter={(value) => [`${value} students`, 'Enrollment']}
            labelFormatter={(label) => `Course: ${label}`}
          />
          <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      {data.length > 5 && (
        <p className="text-center text-xs text-muted-foreground mt-2">
          Showing top 5 of {data.length} courses
        </p>
      )}
    </>
  )
}