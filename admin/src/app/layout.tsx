import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AdminSidebar } from "@/components/admin-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Learn Smart Admin",
  description: "Admin portal for Learn Smart educational platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 overflow-auto pt-16 lg:pt-0 lg:pl-64">{children}</div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
