import type { User, Session } from "@/types/auth"

// Session management
export const setSession = (session: Session): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("session", JSON.stringify(session))
  }
}

export const getSession = (): Session | null => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("session")
    return session ? JSON.parse(session) : null
  }
  return null
}

export const clearSession = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("session")
  }
}

// User management
export const getUser = (): User | null => {
  const session = getSession()
  return session?.user || null
}

export const isAuthenticated = (): boolean => {
  return !!getSession()?.accessToken
}

export const getUserRole = (): string | null => {
  const user = getUser()
  return user?.role || null
}
