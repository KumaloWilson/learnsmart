"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/store"
import { loginUser } from "@/store/slices/auth-slice"
import { LoginForm } from "@/components/login-form"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const resultAction = await dispatch(loginUser(credentials))
      if (loginUser.fulfilled.match(resultAction)) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        })
        router.push("/")
      } else if (loginUser.rejected.match(resultAction)) {
        toast({
          title: "Error",
          description: (resultAction.payload as string) || "Login failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">LearnSmart Admin Portal</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  )
}
