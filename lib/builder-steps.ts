import type { GenerateMode } from "@/lib/identity-types"

export interface BuilderStep {
  id: string
  label: string
  shortLabel: string
}

export const BUILDER_STEPS: BuilderStep[] = [
  { id: "type", label: "Choose Your Squad", shortLabel: "Squad" },
  { id: "photo", label: "Upload & Fit Photo", shortLabel: "Photo" },
  { id: "frame", label: "Pick a Frame", shortLabel: "Frame" },
  { id: "effects", label: "Goa Effects", shortLabel: "Effects" },
  { id: "badges", label: "Builder Badges", shortLabel: "Badges" },
  { id: "class", label: "Builder Class", shortLabel: "Class" },
  { id: "title", label: "Builder Title & Vibe", shortLabel: "Title" },
  { id: "signature", label: "Sign Your ID", shortLabel: "Sign" },
]

/** Step IDs to show per generate mode */
const MODE_STEP_IDS: Record<GenerateMode, string[]> = {
  "pfp":        ["photo", "frame", "effects"],
  "builder-id": ["type", "photo", "frame", "effects", "badges", "class", "title", "signature"],
  "team-id":    ["type", "photo", "frame", "class", "title", "signature"],
}

export function getStepsForMode(mode: GenerateMode): BuilderStep[] {
  const ids = MODE_STEP_IDS[mode]
  return BUILDER_STEPS.filter((s) => ids.includes(s.id))
}
