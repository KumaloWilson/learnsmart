import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
  className?: string
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  return <div className="grid gap-8">{children}</div>
}
