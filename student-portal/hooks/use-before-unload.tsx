"use client"

import { useEffect } from "react"

export function useBeforeUnload(enabled: boolean, message: string) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (enabled) {
        e.preventDefault()
        e.returnValue = message
        return message
      }
    }

    if (enabled) {
      window.addEventListener("beforeunload", handleBeforeUnload)
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [enabled, message])
}
