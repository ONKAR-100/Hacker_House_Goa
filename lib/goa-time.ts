import * as SunCalc from "suncalc"

// Goa, India coordinates
export const GOA_LAT = 15.2993
export const GOA_LON = 73.8278
export const GOA_TIMEZONE = "Asia/Kolkata"

export type GoaPhase =
  | "dawn"
  | "sunrise"
  | "morning"
  | "day"
  | "golden-hour"
  | "sunset"
  | "dusk"
  | "night"

export interface PhasePalette {
  skyTop: string
  skyBottom: string
  sunMoonColor: string
  sunMoonGlow: string
  oceanTop: string
  oceanBottom: string
  accent: string
  glow: string
  particle: string
  overlay: string
  label: string
}

// Base palettes per phase — using Goa travel color palette
export const PHASE_PALETTES: Record<GoaPhase, PhasePalette> = {
  dawn: {
    skyTop: "#164A41",
    skyBottom: "#FF6B5E",
    sunMoonColor: "#FFC857",
    sunMoonGlow: "#FF6B5E",
    oceanTop: "#007C91",
    oceanBottom: "#164A41",
    accent: "#FF6B5E",
    glow: "#FFC857",
    particle: "#F2F9F6",
    overlay: "rgba(22,74,65,0.25)",
    label: "Dawn Breaking",
  },
  sunrise: {
    skyTop: "#FF6B5E",
    skyBottom: "#FFC857",
    sunMoonColor: "#FFC857",
    sunMoonGlow: "#FF6B5E",
    oceanTop: "#007C91",
    oceanBottom: "#164A41",
    accent: "#FF6B5E",
    glow: "#FFC857",
    particle: "#F2F9F6",
    overlay: "rgba(255,107,94,0.12)",
    label: "Sunrise Session",
  },
  morning: {
    skyTop: "#007C91",
    skyBottom: "#7EDDD3",
    sunMoonColor: "#FFC857",
    sunMoonGlow: "#FFC857",
    oceanTop: "#007C91",
    oceanBottom: "#164A41",
    accent: "#007C91",
    glow: "#FFC857",
    particle: "#FFFCF5",
    overlay: "rgba(0,124,145,0.08)",
    label: "Good Morning, Builder",
  },
  day: {
    skyTop: "#007C91",
    skyBottom: "#7EDDD3",
    sunMoonColor: "#FFC857",
    sunMoonGlow: "#FFC857",
    oceanTop: "#007C91",
    oceanBottom: "#164A41",
    accent: "#007C91",
    glow: "#FFC857",
    particle: "#FFFCF5",
    overlay: "rgba(0,124,145,0.05)",
    label: "Full Beach Mode",
  },
  "golden-hour": {
    skyTop: "#FF6B5E",
    skyBottom: "#FFC857",
    sunMoonColor: "#FFC857",
    sunMoonGlow: "#FF6B5E",
    oceanTop: "#007C91",
    oceanBottom: "#164A41",
    accent: "#FFC857",
    glow: "#FF6B5E",
    particle: "#F2F9F6",
    overlay: "rgba(255,107,94,0.16)",
    label: "Golden Hour Ship",
  },
  sunset: {
    skyTop: "#164A41",
    skyBottom: "#FF6B5E",
    sunMoonColor: "#FF6B5E",
    sunMoonGlow: "#FFC857",
    oceanTop: "#164A41",
    oceanBottom: "#164A41",
    accent: "#FF6B5E",
    glow: "#FFC857",
    particle: "#F2F9F6",
    overlay: "rgba(22,74,65,0.22)",
    label: "Sunset Shipping Hour",
  },
  dusk: {
    skyTop: "#164A41",
    skyBottom: "#007C91",
    sunMoonColor: "#7EDDD3",
    sunMoonGlow: "#007C91",
    oceanTop: "#164A41",
    oceanBottom: "#164A41",
    accent: "#7EDDD3",
    glow: "#007C91",
    particle: "#7EDDD3",
    overlay: "rgba(22,74,65,0.35)",
    label: "Dusk Debug Session",
  },
  night: {
    skyTop: "#0a1f1a",
    skyBottom: "#164A41",
    sunMoonColor: "#7EDDD3",
    sunMoonGlow: "#007C91",
    oceanTop: "#0a1f1a",
    oceanBottom: "#050f0c",
    accent: "#7EDDD3",
    glow: "#007C91",
    particle: "#FFFCF5",
    overlay: "rgba(10,31,26,0.4)",
    label: "Midnight Builder Mode",
  },
}

const PHASE_ORDER: GoaPhase[] = [
  "night",
  "dawn",
  "sunrise",
  "morning",
  "day",
  "golden-hour",
  "sunset",
  "dusk",
  "night",
]

export interface GoaTimes {
  sunrise: Date
  sunset: Date
  dawn: Date
  dusk: Date
  goldenHourStart: Date // evening golden hour start
  goldenHourEnd: Date
  night: Date
  nightEnd: Date
  solarNoon: Date
  nadir: Date
}

export function getGoaTimes(date: Date): GoaTimes {
  const t = SunCalc.getTimes(date, GOA_LAT, GOA_LON)
  const d = (val: Date | null | undefined) => (val && !isNaN(val.getTime()) ? val : date)
  return {
    sunrise: d(t.sunrise),
    sunset: d(t.sunset),
    dawn: d(t.dawn),
    dusk: d(t.dusk),
    goldenHourStart: d(t.goldenHour),
    goldenHourEnd: d(t.sunset),
    night: d(t.night),
    nightEnd: d(t.nightEnd),
    solarNoon: d(t.solarNoon),
    nadir: d(t.nadir),
  }
}

export interface GoaPhaseInfo {
  phase: GoaPhase
  nextPhase: GoaPhase
  /** 0-1 progress through current phase window, used for crossfade interpolation */
  progress: number
  isDay: boolean
  windowStart: Date
  windowEnd: Date
}

/**
 * Determine the current phase and interpolation progress toward the next phase.
 */
export function getPhaseInfo(date: Date, times: GoaTimes): GoaPhaseInfo {
  const boundaries: { phase: GoaPhase; start: Date }[] = [
    { phase: "night", start: times.nightEnd }, // placeholder, corrected below
  ]

  // Build ordered boundaries for a single day using nearest sun events
  const ordered: { phase: GoaPhase; time: Date }[] = [
    { phase: "dawn" as GoaPhase, time: times.dawn },
    { phase: "sunrise" as GoaPhase, time: times.sunrise },
    { phase: "morning" as GoaPhase, time: addMinutes(times.sunrise, 90) },
    { phase: "day" as GoaPhase, time: addMinutes(times.solarNoon, -120) },
    { phase: "golden-hour" as GoaPhase, time: times.goldenHourStart },
    { phase: "sunset" as GoaPhase, time: times.sunset },
    { phase: "dusk" as GoaPhase, time: times.dusk },
    { phase: "night" as GoaPhase, time: times.night },
  ].sort((a, b) => a.time.getTime() - b.time.getTime())

  // Find current segment
  let current = ordered[ordered.length - 1]
  let next = ordered[0]
  for (let i = 0; i < ordered.length; i++) {
    const seg = ordered[i]
    const nextSeg = ordered[(i + 1) % ordered.length]
    const segStart = seg.time
    let segEnd = nextSeg.time
    // handle wrap across midnight
    if (segEnd.getTime() <= segStart.getTime()) {
      segEnd = addMinutes(segEnd, 24 * 60)
    }
    let checkDate = date
    if (date.getTime() < segStart.getTime() && i === ordered.length - 1) {
      checkDate = addMinutes(date, 24 * 60)
    }
    if (checkDate.getTime() >= segStart.getTime() && checkDate.getTime() < segEnd.getTime()) {
      current = seg
      next = nextSeg
      const total = segEnd.getTime() - segStart.getTime()
      const elapsed = checkDate.getTime() - segStart.getTime()
      const progress = total > 0 ? Math.min(1, Math.max(0, elapsed / total)) : 0
      const isDay = seg.phase !== "night" && seg.phase !== "dusk" && seg.phase !== "dawn"
      return {
        phase: seg.phase,
        nextPhase: nextSeg.phase,
        progress,
        isDay,
        windowStart: segStart,
        windowEnd: segEnd,
      }
    }
  }

  return {
    phase: current.phase,
    nextPhase: next.phase,
    progress: 0,
    isDay: false,
    windowStart: current.time,
    windowEnd: next.time,
  }
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "")
  const bigint = Number.parseInt(clean, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0")
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function interpolateColor(colorA: string, colorB: string, t: number): string {
  if (colorA.startsWith("rgba") || colorB.startsWith("rgba")) return t < 0.5 ? colorA : colorB
  const [r1, g1, b1] = hexToRgb(colorA)
  const [r2, g2, b2] = hexToRgb(colorB)
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t))
}

export function interpolatePalette(a: PhasePalette, b: PhasePalette, t: number): PhasePalette {
  return {
    skyTop: interpolateColor(a.skyTop, b.skyTop, t),
    skyBottom: interpolateColor(a.skyBottom, b.skyBottom, t),
    sunMoonColor: interpolateColor(a.sunMoonColor, b.sunMoonColor, t),
    sunMoonGlow: interpolateColor(a.sunMoonGlow, b.sunMoonGlow, t),
    oceanTop: interpolateColor(a.oceanTop, b.oceanTop, t),
    oceanBottom: interpolateColor(a.oceanBottom, b.oceanBottom, t),
    accent: interpolateColor(a.accent, b.accent, t),
    glow: interpolateColor(a.glow, b.glow, t),
    particle: interpolateColor(a.particle, b.particle, t),
    overlay: t < 0.5 ? a.overlay : b.overlay,
    label: t < 0.5 ? a.label : b.label,
  }
}

export function formatCountdown(target: Date, from: Date): string {
  const diffMs = target.getTime() - from.getTime()
  const diffMin = Math.round(diffMs / 60000)
  if (diffMin <= 0) return "now"
  if (diffMin < 60) return `${diffMin} min`
  const hrs = Math.floor(diffMin / 60)
  const mins = diffMin % 60
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

export function formatGoaTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: GOA_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}
