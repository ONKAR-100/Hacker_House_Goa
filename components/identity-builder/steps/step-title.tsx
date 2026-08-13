"use client"

import { cn } from "@/lib/utils"
import { BUILDER_TITLE_PRESETS, BUILDER_VIBES } from "@/lib/builder-data"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"

export function StepTitle() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Builder Title & Vibe</h3>
        <p className="mt-1 text-sm text-muted-foreground">Give your identity a title, a vibe, and a stack line.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="builder-title" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Builder Title
        </label>
        <input
          id="builder-title"
          value={state.title}
          onChange={(e) => dispatch({ type: "SET_TITLE", title: e.target.value })}
          placeholder="e.g. Code Surfer"
          maxLength={28}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        <div className="flex flex-wrap gap-1.5">
          {BUILDER_TITLE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => dispatch({ type: "SET_TITLE", title: preset })}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                state.title === preset ? "border-transparent text-white" : "border-border text-muted-foreground hover:bg-muted"
              )}
              style={state.title === preset ? { backgroundColor: palette.accent, color: "white" } : undefined}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Builder Vibe</span>
        <div className="flex flex-wrap gap-2">
          {BUILDER_VIBES.map((vibe) => {
            const active = state.vibe === vibe.id
            return (
              <button
                key={vibe.id}
                type="button"
                onClick={() => dispatch({ type: "SET_VIBE", vibe: vibe.id })}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                  active ? "border-transparent text-white shadow-sm" : "border-border text-foreground hover:bg-muted"
                )}
                style={active ? { backgroundColor: palette.accent, color: "white" } : undefined}
                aria-pressed={active}
              >
                <span aria-hidden="true">{vibe.emoji}</span>
                {vibe.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="stack-line" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          I Build ___
        </label>
        <input
          id="stack-line"
          value={state.stackLine}
          onChange={(e) => dispatch({ type: "SET_STACK_LINE", stackLine: e.target.value })}
          placeholder="e.g. AI agents, weird APIs, and sandcastles"
          maxLength={48}
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
    </div>
  )
}
