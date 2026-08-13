"use client"

import { ImageIcon, IdCard, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import type { GenerateMode } from "@/lib/identity-types"

interface ModeOption {
  id: GenerateMode
  label: string
  shortDesc: string
  longDesc: string
  icon: typeof ImageIcon
  steps: string[]
  emoji: string
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: "pfp",
    label: "Profile Picture",
    shortDesc: "Just the photo",
    longDesc: "Crop, frame, and apply Goa effects to your photo. Export a perfect circle or square PFP ready for socials.",
    icon: ImageIcon,
    steps: ["Photo", "Frame", "Effects"],
    emoji: "🌅",
  },
  {
    id: "builder-id",
    label: "Solo Builder ID",
    shortDesc: "Full solo identity card",
    longDesc: "The complete HH Goa 2026 experience — photo, frame, effects, badges, class, title, and signature on one shareable card.",
    icon: IdCard,
    steps: ["Photo", "Frame", "Effects", "Badges", "Class", "Title", "Sign"],
    emoji: "🪪",
  },
  {
    id: "team-id",
    label: "Team Pass ID",
    shortDesc: "Horizontal Squad Pass",
    longDesc: "Official Team Pass for Solo, Duo, or Trio squads — featuring Team Name, Leader & Member PFPs, roles, and squad title.",
    icon: Users,
    steps: ["Squad Type", "Team Info", "Member PFPs", "Roles", "Badges", "Title"],
    emoji: "👥",
  },
]

export function GenerateModePicker() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()

  const handleSelect = (mode: GenerateMode) => {
    dispatch({ type: "SET_GENERATE_MODE", mode })
  }

  return (
    <div className="mb-8 flex flex-col gap-4">
      {/* Section header */}
      <div className="text-center">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-widest"
          style={{ backgroundColor: `${palette.accent}18`, color: palette.accent }}
        >
          Step 0 — Choose What to Generate
        </span>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick the output you want, then we'll guide you through the right steps.
        </p>
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {MODE_OPTIONS.map((opt) => {
          const Icon = opt.icon
          const active = state.generateMode === opt.id

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "group relative flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                active
                  ? "shadow-lg"
                  : "border-border bg-card hover:border-border/80 hover:shadow-md"
              )}
              style={
                active
                  ? {
                      borderColor: palette.accent,
                      backgroundColor: `${palette.accent}0d`,
                      boxShadow: `0 4px 24px ${palette.accent}22`,
                    }
                  : undefined
              }
            >
              {/* Active indicator dot */}
              {active && (
                <span
                  className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: palette.accent }}
                >
                  <svg viewBox="0 0 12 12" className="size-3 fill-white">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}

              {/* Icon */}
              <div
                className="flex size-10 items-center justify-center rounded-xl transition-all"
                style={{
                  backgroundColor: active ? palette.accent : "var(--muted)",
                  color: active ? "white" : "var(--muted-foreground)",
                }}
              >
                <Icon className="size-5" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-base font-bold text-foreground">{opt.label}</span>
                  <span className="text-base">{opt.emoji}</span>
                </div>
                <p className="mt-0.5 text-xs font-medium" style={{ color: active ? palette.accent : "var(--muted-foreground)" }}>
                  {opt.shortDesc}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{opt.longDesc}</p>
              </div>

              {/* Steps pill */}
              <div className="flex flex-wrap gap-1">
                {opt.steps.map((step) => (
                  <span
                    key={step}
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: active ? `${palette.accent}18` : "var(--muted)",
                      color: active ? palette.accent : "var(--muted-foreground)",
                    }}
                  >
                    {step}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
