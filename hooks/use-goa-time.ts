"use client"

import { useEffect, useMemo, useState } from "react"
import {
  getGoaTimes,
  getPhaseInfo,
  interpolatePalette,
  PHASE_PALETTES,
  formatCountdown,
  formatGoaTime,
  type GoaPhase,
  type PhasePalette,
} from "@/lib/goa-time"

export interface GoaTimeState {
  now: Date
  phase: GoaPhase
  nextPhase: GoaPhase
  progress: number
  isDay: boolean
  palette: PhasePalette
  localTimeLabel: string
  sunriseLabel: string
  sunsetLabel: string
  countdownLabel: string
  reducedMotion: boolean
  isManualOverride: boolean
  manualHour: number | null
  setManualHour: (hour: number | null) => void
  setManualPhase: (phase: GoaPhase | null) => void
  resetToLiveTime: () => void
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

const PHASE_HOURS: Record<GoaPhase, number> = {
  dawn: 5,
  sunrise: 6,
  morning: 9,
  day: 13,
  "golden-hour": 17,
  sunset: 18,
  dusk: 19,
  night: 22,
}

export function useGoaTime(): GoaTimeState {
  const [liveNow, setLiveNow] = useState<Date>(() => new Date())
  const [manualHour, setManualHourState] = useState<number | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const interval = setInterval(() => setLiveNow(new Date()), 30_000)
    return () => clearInterval(interval)
  }, [])

  const effectiveNow = useMemo(() => {
    if (manualHour === null) return liveNow
    const d = new Date(liveNow)
    d.setHours(manualHour, 0, 0, 0)
    return d
  }, [liveNow, manualHour])

  const times = useMemo(() => getGoaTimes(effectiveNow), [effectiveNow.toDateString()])
  const info = useMemo(() => getPhaseInfo(effectiveNow, times), [effectiveNow, times])

  const palette = useMemo(() => {
    const a = PHASE_PALETTES[info.phase]
    const b = PHASE_PALETTES[info.nextPhase]
    return interpolatePalette(a, b, info.progress)
  }, [info])

  const sunriseLabel = useMemo(() => formatGoaTime(times.sunrise), [times])
  const sunsetLabel = useMemo(() => formatGoaTime(times.sunset), [times])
  const localTimeLabel = useMemo(() => formatGoaTime(effectiveNow), [effectiveNow])

  const countdownLabel = useMemo(() => {
    if (info.isDay) {
      return `Sunset in ${formatCountdown(times.sunset, effectiveNow)}`
    }
    const target = effectiveNow < times.sunrise ? times.sunrise : new Date(times.sunrise.getTime() + 86400000)
    return `Sunrise in ${formatCountdown(target, effectiveNow)}`
  }, [info.isDay, effectiveNow, times])

  const setManualHour = (hour: number | null) => {
    setManualHourState(hour)
  }

  const setManualPhase = (phase: GoaPhase | null) => {
    if (phase === null) {
      setManualHourState(null)
    } else {
      setManualHourState(PHASE_HOURS[phase])
    }
  }

  const resetToLiveTime = () => {
    setManualHourState(null)
    setLiveNow(new Date())
  }

  return {
    now: effectiveNow,
    phase: info.phase,
    nextPhase: info.nextPhase,
    progress: info.progress,
    isDay: info.isDay,
    palette,
    localTimeLabel,
    sunriseLabel,
    sunsetLabel,
    countdownLabel,
    reducedMotion,
    isManualOverride: manualHour !== null,
    manualHour,
    setManualHour,
    setManualPhase,
    resetToLiveTime,
  }
}
