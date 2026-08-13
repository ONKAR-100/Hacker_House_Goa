// Static option data for the HH Goa 2026 Identity Builder.
// Kept separate from time/atmosphere state per the "do not destroy user customization" rule —
// none of this depends on the current Goa phase.

export type IdentityType = "solo" | "duo" | "trio"

export interface FrameOption {
  id: string
  name: string
  category: "Goa" | "Hacker"
  /** Preferred atmosphere phase this frame is recommended for (badge only, never auto-applied) */
  recommendedPhase?: string
  colors: [string, string]
  description: string
}

export const FRAME_OPTIONS: FrameOption[] = [
  {
    id: "sunset-ring",
    name: "Sunset Ring",
    category: "Goa",
    recommendedPhase: "sunset",
    colors: ["#FF6B5E", "#FFC857"],
    description: "Sunset Coral-to-Mango Gold gradient ring.",
  },
  {
    id: "ocean-wave",
    name: "Ocean Wave",
    category: "Goa",
    recommendedPhase: "day",
    colors: ["#007C91", "#7EDDD3"],
    description: "Goa Ocean-to-Seafoam gradient ring.",
  },
  {
    id: "tropical-leaf",
    name: "Tropical",
    category: "Goa",
    recommendedPhase: "morning",
    colors: ["#164A41", "#7EDDD3"],
    description: "Deep Palm-to-Seafoam ring.",
  },
  {
    id: "palm-paradise",
    name: "Palm Paradise",
    category: "Goa",
    recommendedPhase: "golden-hour",
    colors: ["#FF6B5E", "#007C91"],
    description: "Sunset Coral-to-Goa Ocean gradient ring.",
  },
  {
    id: "coastal-glow",
    name: "Coastal Glow",
    category: "Goa",
    recommendedPhase: "golden-hour",
    colors: ["#FFC857", "#FF6B5E"],
    description: "Mango Gold-to-Sunset Coral glowing ring.",
  },
  {
    id: "moonlit-beach",
    name: "Moonlit Beach",
    category: "Goa",
    recommendedPhase: "night",
    colors: ["#007C91", "#164A41"],
    description: "Goa Ocean-to-Deep Palm dark ring.",
  },
  {
    id: "neon-goa",
    name: "Neon Goa",
    category: "Goa",
    recommendedPhase: "dusk",
    colors: ["#7EDDD3", "#FF6B5E"],
    description: "Seafoam-to-Sunset Coral neon ring.",
  },
  {
    id: "goa-night",
    name: "Goa Night",
    category: "Goa",
    recommendedPhase: "night",
    colors: ["#164A41", "#007C91"],
    description: "Deep Palm-to-Goa Ocean midnight ring.",
  },
  {
    id: "terminal",
    name: "Terminal",
    category: "Hacker",
    colors: ["#164A41", "#7EDDD3"],
    description: "CLI border in Deep Palm and Seafoam.",
  },
  {
    id: "matrix",
    name: "Matrix",
    category: "Hacker",
    colors: ["#007C91", "#FFC857"],
    description: "Goa Ocean to Mango Gold matrix ring.",
  },
  {
    id: "circuit",
    name: "Circuit",
    category: "Hacker",
    colors: ["#164A41", "#FF6B5E"],
    description: "Deep Palm & Sunset Coral circuit ring.",
  },
  {
    id: "neon-grid",
    name: "Neon Grid",
    category: "Hacker",
    colors: ["#FF6B5E", "#7EDDD3"],
    description: "Sunset Coral to Seafoam grid ring.",
  },
]

export const GOA_EFFECTS = [
  { id: "waves", label: "Ocean Waves", emoji: "🌊" },
  { id: "dolphin", label: "Dolphin Jump", emoji: "🐬" },
  { id: "bubbles", label: "Bubbles", emoji: "🫧" },
  { id: "palms", label: "Swaying Palms", emoji: "🌴" },
  { id: "sunset-glow", label: "Sunset Glow", emoji: "🌇" },
  { id: "neon-particles", label: "Neon Particles", emoji: "✨" },
] as const

export type GoaEffectId = (typeof GOA_EFFECTS)[number]["id"]

export const BUILDER_BADGES = [
  { id: "early-bird", label: "Early Bird", emoji: "🌅" },
  { id: "night-owl", label: "Night Owl", emoji: "🌙" },
  { id: "ship-it", label: "Ship It", emoji: "🚀" },
  { id: "debugger", label: "Debugger", emoji: "🐛" },
  { id: "full-stack", label: "Full Stack", emoji: "🥞" },
  { id: "open-source", label: "Open Source", emoji: "🌱" },
  { id: "first-hackathon", label: "First Hackathon", emoji: "🎉" },
  { id: "goa-local", label: "Goa Local", emoji: "🏖️" },
  { id: "coffee-powered", label: "Coffee Powered", emoji: "☕" },
  { id: "solo-shipper", label: "Solo Shipper", emoji: "🏄" },
] as const

export type BadgeId = (typeof BUILDER_BADGES)[number]["id"]

export const BUILDER_CLASSES = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Designer",
  "Data / AI",
  "DevOps",
  "Product",
  "Hardware",
] as const

export type BuilderClass = (typeof BUILDER_CLASSES)[number]

export const BUILDER_TITLE_PRESETS = [
  "Code Surfer",
  "Beach Debugger",
  "Sunset Shipper",
  "Terminal Wanderer",
  "Coconut Committer",
  "Tide Pool Hacker",
  "Palm Tree Pusher",
  "Monsoon Merger",
] as const

export const BUILDER_VIBES = [
  { id: "chill", label: "Chill", emoji: "🏖️" },
  { id: "chaotic", label: "Chaotic", emoji: "🌀" },
  { id: "locked-in", label: "Locked In", emoji: "🎯" },
  { id: "party", label: "Party", emoji: "🎊" },
  { id: "zen", label: "Zen", emoji: "🧘" },
] as const

export type BuilderVibe = (typeof BUILDER_VIBES)[number]["id"]

export function generatePassId(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `HH-2026-${num}`
}

export function generateSerial(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let out = ""
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}
