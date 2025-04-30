"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center bg-muted/40">
      <LoginForm />
    </div>
  )
}
