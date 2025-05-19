import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  loading?: boolean
  actions?: ReactNode
}

export function PageContainer({
  children,
  title,
  description,
  className,
  loading = false,
  actions,
}: PageContainerProps) {
  return (
    <div className="container py-6 md:py-8 p-8">
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      {actions && <div className="flex-shrink-0 mb-6">{actions}</div>}
      <div className={cn("", className)}>{children}</div>
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
