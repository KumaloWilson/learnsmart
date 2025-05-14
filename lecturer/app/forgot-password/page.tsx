"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useForgotPassword } from "@/lib/auth/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const { forgotPassword, isLoading, error, success } = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await forgotPassword({ email })
    } catch (err) {
      // Error is handled by the hook
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@learnsmart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || !!success}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !!success}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" className="flex items-center text-sm text-primary hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
