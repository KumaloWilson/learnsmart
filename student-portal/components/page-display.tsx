import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PageDisplayProps {
  title: string
}

export function PageDisplay({ title }: PageDisplayProps) {
  return (
    <div className="flex flex-col gap-6 w-full h-full animate-in fade-in-50 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">This is the {title.toLowerCase()} page of LearnSmart</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title} Overview</CardTitle>
          <CardDescription>
            This section provides an overview of your {title.toLowerCase()} information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
            <p className="text-center text-muted-foreground">{title} content will be displayed here</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid w-full gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Additional information about {title.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed">
              <p className="text-center text-muted-foreground">Details will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Key metrics and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed">
              <p className="text-center text-muted-foreground">Statistics will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
