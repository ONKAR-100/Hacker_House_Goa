"use client"

import { cn } from "@/lib/utils"
import { BUILDER_BADGES } from "@/lib/builder-data"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"

export function StepBadges() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()
  const maxed = state.badges.length >= 4

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Builder Badges</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick up to 4 badges that describe you. {state.badges.length}/4 selected.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {BUILDER_BADGES.map((badge) => {
          const active = state.badges.includes(badge.id)
          const disabled = !active && maxed
          return (
            <button
              key={badge.id}
              type="button"
              disabled={disabled}
              onClick={() => dispatch({ type: "TOGGLE_BADGE", badge: badge.id })}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                active
                  ? "border-transparent text-white shadow-sm"
                  : disabled
                    ? "border-border/50 text-muted-foreground/50"
                    : "border-border text-foreground hover:bg-muted"
              )}
              style={active ? { backgroundColor: palette.accent, color: "white" } : undefined}
              aria-pressed={active}
            >
              <span aria-hidden="true">{badge.emoji}</span>
              {badge.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
