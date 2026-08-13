"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { FRAME_OPTIONS } from "@/lib/builder-data"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"

const CATEGORIES = ["Goa", "Hacker"] as const

export function StepFrame() {
  const { state, dispatch } = useIdentity()
  const { phase, palette } = useGoaTimeContext()
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Goa")

  const frames = FRAME_OPTIONS.filter((f) => f.category === category)

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Pick a Frame</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Goa-themed rings or hacker-mode borders. The starred frame suits right now in Goa — pick whatever fits your vibe.
        </p>
      </div>

      <div className="flex gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
              category === cat ? "text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"
            )}
            style={category === cat ? { backgroundColor: palette.accent, color: "white" } : undefined}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {frames.map((frame) => {
          const active = state.frameId === frame.id
          const recommended = frame.recommendedPhase === phase
          return (
            <button
              key={frame.id}
              type="button"
              onClick={() => dispatch({ type: "SET_FRAME", frameId: frame.id })}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                active ? "border-transparent shadow-md" : "border-border hover:bg-muted"
              )}
              style={active ? { outline: `2px solid ${palette.accent}`, outlineOffset: 2 } : undefined}
            >
              <div className="relative">
                <div
                  className="size-14 rounded-full"
                  style={{
                    background: `conic-gradient(from 90deg, ${frame.colors[0]}, ${frame.colors[1]}, ${frame.colors[0]})`,
                    padding: 3,
                  }}
                >
                  <div className="size-full rounded-full bg-background border border-border/30" />
                </div>
                {recommended && (
                  <span
                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: palette.accent }}
                    title="Recommended for the current Goa phase"
                  >
                    <Sparkles className="size-3 text-white" />
                  </span>
                )}
              </div>
              <span className="text-center text-[11px] font-semibold leading-tight text-foreground">
                {frame.name}
              </span>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {FRAME_OPTIONS.find((f) => f.id === state.frameId)?.description}
      </p>
    </div>
  )
}
