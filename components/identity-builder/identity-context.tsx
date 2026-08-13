"use client"

import { createContext, useContext, useEffect, useReducer, useRef, type Dispatch, type ReactNode } from "react"
import { createInitialIdentityState, identityReducer } from "@/lib/identity-reducer"
import type { IdentityAction, IdentityState } from "@/lib/identity-types"

const STORAGE_KEY = "hh-goa-2026-identity-draft"

interface IdentityContextValue {
  state: IdentityState
  dispatch: Dispatch<IdentityAction>
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(identityReducer, undefined, createInitialIdentityState)
  const hydrated = useRef(false)

  // Hydrate once from localStorage on mount (client-only, privacy-first — no backend)
  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as IdentityState
        dispatch({ type: "HYDRATE", state: parsed })
      }
    } catch {
      // ignore corrupt draft
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage full/unavailable — non-critical, drafts just won't persist
    }
  }, [state])

  return <IdentityContext.Provider value={{ state, dispatch }}>{children}</IdentityContext.Provider>
}

export function useIdentity(): IdentityContextValue {
  const ctx = useContext(IdentityContext)
  if (!ctx) throw new Error("useIdentity must be used within IdentityBuilderProvider")
  return ctx
}
