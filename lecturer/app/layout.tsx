import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ReduxProvider } from "@/lib/redux/provider"
import { AuthProvider } from "@/lib/auth/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { AppHeader } from "@/components/app-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartLearn - Lecturer Portal",
  description: "E-learning system for lecturers",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} antialiased h-full`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            <AuthProvider>
              <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                  <AppSidebar />
                  <div className="flex flex-col flex-1 w-full min-h-screen overflow-hidden">
                    <AppHeader />
                    <main className="flex-1 overflow-auto w-full">{children}</main>
                  </div>
                </div>
                <Toaster />
              </SidebarProvider>
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
