import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageContainerProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function PageContainer({ title, description, children, actions }: PageContainerProps) {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}

export function PageSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={`overflow-hidden shadow-sm ${className}`}>
      <CardHeader className="bg-muted/30 dark:bg-muted/10 px-6">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}
