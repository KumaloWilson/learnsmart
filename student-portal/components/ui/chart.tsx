import * as React from "react"

import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("dark:bg-zinc-950 rounded-md border bg-white", className)} ref={ref} {...props} />
  ),
)
ChartContainer.displayName = "ChartContainer"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div className={cn("", className)} ref={ref} {...props} />
))
Chart.displayName = "Chart"

const ChartLegend = React.forwardRef<
  HTMLDivElement,
  { items?: { name: string; color: string }[] } & React.HTMLAttributes<HTMLDivElement>
>(({ className, items, ...props }, ref) => (
  <div className={cn("flex items-center justify-center space-x-2 text-sm", className)} ref={ref} {...props}>
    {items?.map((item) => (
      <div key={item.name} className="flex items-center space-x-1">
        <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
        <span>{item.name}</span>
      </div>
    ))}
  </div>
))
ChartLegend.displayName = "ChartLegend"

interface ChartTooltipContentProps {
  items: (props: { payload: any[] | null | undefined }) => React.ReactNode
}

const ChartTooltipContent = ({ items }: ChartTooltipContentProps) => {
  return <div className="rounded-md border bg-popover p-2 text-sm shadow-sm">{items({ payload: null })}</div>
}
ChartTooltipContent.displayName = "ChartTooltipContent"

interface ChartTooltipItemProps {
  label: string
  value: string
  color: string
}

const ChartTooltipItem = ({ label, value, color }: ChartTooltipItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      <span>
        {label}: {value}
      </span>
    </div>
  )
}
ChartTooltipItem.displayName = "ChartTooltipItem"

const ChartTooltip = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { content: React.ReactNode }
>(({ className, content, ...props }, ref) => (
  <div className={cn("", className)} ref={ref} {...props}>
    {content}
  </div>
))
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartContainer, ChartLegend, ChartTooltip, ChartTooltipContent, ChartTooltipItem }
