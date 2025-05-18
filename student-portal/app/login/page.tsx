import { LoginForm } from "@/components/auth/login-form"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30">
      <div className="absolute top-8 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <span className="font-bold text-2xl">LearnSmart</span>
        </Link>
      </div>

      <div className="w-full max-w-md px-4">
        <LoginForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Contact your administrator
          </a>
        </p>
      </div>
    </div>
  )
}
