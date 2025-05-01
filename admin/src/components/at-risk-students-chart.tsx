import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface AtRiskStudentsChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = ["#4f46e5", "#ec4899", "#f59e0b", "#10b981", "#6366f1"]

export function AtRiskStudentsChart({ data }: AtRiskStudentsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} students`, "At Risk"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
