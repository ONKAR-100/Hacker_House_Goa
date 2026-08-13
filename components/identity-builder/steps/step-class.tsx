"use client"

import { cn } from "@/lib/utils"
import { BUILDER_CLASSES } from "@/lib/builder-data"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"

export function StepClass() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Builder Class</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {state.members.length > 1
            ? "Pick each builder's primary class — this powers your team's Skill Fusion tagline."
            : "What's your primary craft?"}
        </p>
      </div>

      {state.members.map((member, i) => (
        <div key={member.id} className="flex flex-col gap-2">
          {state.members.length > 1 && (
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {member.name || `Builder ${i + 1}`}
            </span>
          )}
          <div className="flex flex-wrap gap-2">
            {BUILDER_CLASSES.map((cls) => {
              const active = member.builderClass === cls
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => dispatch({ type: "SET_MEMBER_CLASS", memberId: member.id, builderClass: cls })}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                    active ? "border-transparent text-white shadow-sm" : "border-border text-foreground hover:bg-muted"
                  )}
                  style={active ? { backgroundColor: palette.accent, color: "white" } : undefined}
                  aria-pressed={active}
                >
                  {cls}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
