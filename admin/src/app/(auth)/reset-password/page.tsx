"use client"
import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

function ResetPasswordPageContent() {
  return <ResetPasswordForm />
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  )
}