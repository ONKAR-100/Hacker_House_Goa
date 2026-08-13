"use client"

import { User, Users, Users2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIdentity } from "@/components/identity-builder/identity-context"
import type { IdentityType } from "@/lib/builder-data"
import { useGoaTimeContext } from "@/components/goa-time-provider"

const TYPE_OPTIONS: { id: IdentityType; label: string; description: string; icon: typeof User }[] = [
  { id: "solo", label: "Solo Builder", description: "One photo, one identity, full spotlight.", icon: User },
  { id: "duo", label: "Duo Builders", description: "Two builders, one shared Goa ID.", icon: Users },
  { id: "trio", label: "Trio Team", description: "Three builders, one squad card.", icon: Users2 },
]

export function StepType() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-display text-xl font-bold text-foreground">Choose Your Squad</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Building solo, with a partner, or as a full team? Pick your Builder ID format.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TYPE_OPTIONS.map((opt) => {
          const Icon = opt.icon
          const active = state.idType === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => dispatch({ type: "SET_ID_TYPE", idType: opt.id })}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
                active ? "border-transparent shadow-md" : "border-border hover:bg-muted"
              )}
              style={active ? { backgroundColor: `${palette.accent}1a`, borderColor: palette.accent } : undefined}
            >
              <div
                className="flex size-9 items-center justify-center rounded-full"
                style={{ backgroundColor: active ? palette.accent : "var(--muted)" }}
              >
                <Icon className={cn("size-4.5", active ? "text-white" : "text-muted-foreground")} />
              </div>
              <span className="font-display text-base font-bold text-foreground">{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.description}</span>
            </button>
          )
        })}
      </div>
      {state.idType !== "solo" && (
        <div className="flex flex-col gap-2">
          <label htmlFor="team-name" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Team Name
          </label>
          <input
            id="team-name"
            value={state.teamName}
            onChange={(e) => dispatch({ type: "SET_TEAM_NAME", teamName: e.target.value })}
            placeholder="e.g. The Coconut Committers"
            maxLength={40}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      )}
    </div>
  )
}
