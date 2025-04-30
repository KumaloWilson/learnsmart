import { Heading } from "@/components/ui/heading"

interface PageHeaderProps {
  title: string
  description?: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      <Heading as="h1" size="3xl">
        {title}
      </Heading>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  )
}
