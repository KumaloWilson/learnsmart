import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check for token in cookies
  const token = request.cookies.get("token")?.value
  
  // If no token in cookies, check for token in Authorization header
  const authHeader = request.headers.get("Authorization")
  const headerToken = authHeader ? authHeader.replace("Bearer ", "") : null
  
  const isAuthPage = request.nextUrl.pathname === "/login"
  const hasToken = token || headerToken

  // If trying to access auth page with token, redirect to dashboard
  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // If trying to access protected page without token, redirect to login
  if (!isAuthPage && !hasToken) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}