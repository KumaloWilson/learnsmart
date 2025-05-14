import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageContainerProps {
  title: string
  description?: string
  children: ReactNode
}

export function PageContainer({ title, description, children }: PageContainerProps) {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{title} Overview</CardTitle>
          <CardDescription>Manage your {title.toLowerCase()} information</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
