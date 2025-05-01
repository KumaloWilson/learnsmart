import type { ReactNode } from "react"

interface PageHeaderProps {
  title?: string
  heading?: string
  description?: string
  text?: string
  actions?: ReactNode
}

export function PageHeader({ title, heading, description, text, actions }: PageHeaderProps) {
  const headerTitle = title || heading
  const headerDescription = description || text

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{headerTitle}</h1>
        {headerDescription && <p className="mt-2 text-lg text-muted-foreground">{headerDescription}</p>}
      </div>
      {actions && <div className="flex items-center gap-4">{actions}</div>}
    </div>
  )
}
