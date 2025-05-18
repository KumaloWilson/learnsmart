import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { GraduationCap } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
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
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
