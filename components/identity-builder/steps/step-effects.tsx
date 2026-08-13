"use client"

import { cn } from "@/lib/utils"
import { GOA_EFFECTS } from "@/lib/builder-data"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"

export function StepEffects() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Goa Effects</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Layer on living touches for your card. Mix and match — nothing is exclusive.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GOA_EFFECTS.map((effect) => {
          const active = state.effects.includes(effect.id)
          return (
            <button
              key={effect.id}
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_EFFECT", effect: effect.id })}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-3 text-left transition-all",
                active ? "border-transparent shadow-sm" : "border-border hover:bg-muted"
              )}
              style={active ? { backgroundColor: `${palette.accent}1a`, borderColor: palette.accent } : undefined}
              aria-pressed={active}
            >
              <span className="text-xl leading-none" aria-hidden="true">
                {effect.emoji}
              </span>
              <span className="text-sm font-medium text-foreground">{effect.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
