import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Providers } from "@/lib/providers"
import { AuthGuard } from "@/components/auth/auth-guard"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartLearn Admin Portal",
  description: "E-learning system administration portal",
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Providers>
            <AuthGuard>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-8 pt-6">{children}</div>
              </div>
            </AuthGuard>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
