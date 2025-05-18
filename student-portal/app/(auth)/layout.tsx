import type React from "react"
import { Award } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted/40">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6 shadow-sm">
        {/* Left side - Auth form */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Award className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold">LearnSmart</span>
                <span className="text-xs text-muted-foreground">AI-Powered Learning</span>
              </div>
            </div>
            {children}
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex h-full items-center justify-center p-12">
              <div className="max-w-2xl text-white">
                <h2 className="text-4xl font-bold mb-6">Transform Your Learning Experience</h2>
                <p className="text-xl mb-8">
                  LearnSmart combines cutting-edge AI technology with proven educational methods to deliver a
                  personalized learning experience.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">AI-Powered Recommendations</h3>
                    <p className="text-sm text-blue-100">
                      Get personalized learning resources based on your performance.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Interactive Virtual Classes</h3>
                    <p className="text-sm text-blue-100">Join live sessions with instructors and fellow students.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Detailed Performance Analytics</h3>
                    <p className="text-sm text-blue-100">
                      Track your progress with comprehensive performance insights.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">Seamless Academic Records</h3>
                    <p className="text-sm text-blue-100">Access your academic history and achievements in one place.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
