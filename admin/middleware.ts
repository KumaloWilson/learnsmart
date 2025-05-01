import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for token in cookies (server-side)
  const token = request.cookies.get("accessToken")?.value
  const isAuthPage = request.nextUrl.pathname === "/login"

  // If trying to access auth page with token, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If trying to access protected page without token, redirect to login
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}