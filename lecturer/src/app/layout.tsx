import type React from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { LecturerSidebar } from "@/components/lecturer-sidebar"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Learn Smart - Lecturer Portal",
  description: "Lecturer portal for the Learn Smart platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex min-h-screen">
              <LecturerSidebar />
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}