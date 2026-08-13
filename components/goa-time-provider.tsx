"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useGoaTime, type GoaTimeState } from "@/hooks/use-goa-time"

const GoaTimeContext = createContext<GoaTimeState | null>(null)

export function GoaTimeProvider({ children }: { children: ReactNode }) {
  const state = useGoaTime()
  return <GoaTimeContext.Provider value={state}>{children}</GoaTimeContext.Provider>
}

export function useGoaTimeContext(): GoaTimeState {
  const ctx = useContext(GoaTimeContext)
  if (!ctx) throw new Error("useGoaTimeContext must be used within GoaTimeProvider")
  return ctx
}
