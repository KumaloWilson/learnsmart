import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </AuthProvider>
  )
}
