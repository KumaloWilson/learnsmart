import { Brain } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-600">
        <Brain className="h-6 w-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-foreground">LearnSmart</span>
        <span className="text-xs text-muted-foreground">AI-Powered Learning</span>
      </div>
    </Link>
  )
}
