"use client"

import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Image src="/logo.svg" alt="LearnSmart Logo" width={120} height={120} priority />
      </div>
      <LoginForm />
    </div>
  )
}
