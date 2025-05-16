"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { GraduationCap, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react"
import { useResetPassword } from "@/lib/auth/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { resetPassword, isLoading, error, success } = useResetPassword()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Invalid reset link",
        description: "The password reset link is invalid or has expired.",
      })
      return
    }

    try {
      await resetPassword({ token, password: data.password })
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      })
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (error) {
      console.error("Reset password error:", error)
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-4">
                <Lock className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold">Invalid Link</h1>
              <p className="mt-2 text-muted-foreground">The password reset link is invalid or has expired.</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg shadow-lg">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Create New Password</h1>
            <p className="mt-2 text-muted-foreground">Enter your new password below</p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {!success ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type={showPassword ? "text" : "password"} className="pl-10 pr-10" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-2">
                        Password must be at least 8 characters and include uppercase, lowercase, and numbers.
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input type={showConfirmPassword ? "text" : "password"} className="pl-10 pr-10" {...field} />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md bg-green-50 p-4 text-center">
                <p className="text-sm text-green-800">
                  Your password has been reset successfully. You will be redirected to the login page shortly.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/login">Go to Login</Link>
              </Button>
            </div>
          )}

          <div className="text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-primary hover:underline">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
