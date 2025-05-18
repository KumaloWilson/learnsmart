import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - LearnSmart",
  description: "Login to your LearnSmart account",
}

export default function LoginPage() {
  return <LoginForm />
}
