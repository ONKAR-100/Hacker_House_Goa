"use client"

import { useState } from "react"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import { Palmtree, Sunrise, Sunset, Clock, RotateCcw, Sliders, X, Sparkles } from "lucide-react"
import { type GoaPhase } from "@/lib/goa-time"

const PHASES: { id: GoaPhase; label: string; time: string; emoji: string }[] = [
  { id: "dawn", label: "Dawn", time: "05:00", emoji: "🌅" },
  { id: "sunrise", label: "Sunrise", time: "06:00", emoji: "🌄" },
  { id: "morning", label: "Morning", time: "09:00", emoji: "☀️" },
  { id: "day", label: "Full Day", time: "13:00", emoji: "🏖️" },
  { id: "golden-hour", label: "Golden Hour", time: "17:00", emoji: "🌇" },
  { id: "sunset", label: "Sunset", time: "18:00", emoji: "🌆" },
  { id: "dusk", label: "Dusk", time: "19:00", emoji: "🌌" },
  { id: "night", label: "Midnight", time: "22:00", emoji: "🌙" },
]

export function GoaStatusWidget({ className = "" }: { className?: string }) {
  const {
    now,
    phase,
    localTimeLabel,
    countdownLabel,
    palette,
    isDay,
    isManualOverride,
    manualHour,
    setManualHour,
    setManualPhase,
    resetToLiveTime,
  } = useGoaTimeContext()

  const [isOpen, setIsOpen] = useState(false)

  const currentHour = manualHour !== null ? manualHour : now.getHours()

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Widget Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2.5 rounded-full border px-4 py-2 text-left backdrop-blur-md shadow-sm transition-all hover:scale-105"
        style={{
          borderColor: isManualOverride ? "#FF6B5E" : `${palette.accent}55`,
          background: isManualOverride ? "rgba(22,74,65,0.9)" : "rgba(11,14,26,0.65)",
        }}
      >
        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: palette.accent }}>
          <Palmtree data-icon="inline-start" className="size-3.5" />
          Goa Now
        </span>
        <span className="text-sm font-extrabold text-white tabular-nums">{localTimeLabel}</span>
        <span className="hidden items-center gap-1 text-xs text-white/80 sm:flex">
          {isDay ? <Sunset data-icon="inline-start" className="size-3.5 text-amber-300" /> : <Sunrise data-icon="inline-start" className="size-3.5 text-teal-300" />}
          {countdownLabel}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200">
          {palette.label}
        </span>

        {/* Override Badge */}
        {isManualOverride ? (
          <span className="ml-1 rounded-full bg-[#FF6B5E] px-2 py-0.5 text-[10px] font-black uppercase text-white animate-pulse">
            MANUAL TIME
          </span>
        ) : (
          <span className="ml-1 flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90 group-hover:bg-white/20">
            <Sliders className="size-3" />
            Control
          </span>
        )}
      </button>

      {/* Floating Time & Theme Control Panel Modal */}
      {isOpen && (
        <div
          className="absolute top-12 z-50 w-80 max-w-[90vw] rounded-2xl border border-border bg-card p-5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
          style={{ borderColor: palette.accent }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-emerald-600" />
              <h3 className="font-display text-sm font-bold text-foreground">Time & Animation Controller</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Time Slider */}
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">Simulate Time of Day:</span>
              <span className="font-mono text-emerald-700 font-bold">{String(currentHour).padStart(2, "0")}:00 IST</span>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={currentHour}
              onChange={(e) => setManualHour(parseInt(e.target.value, 10))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-emerald-100 accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
              <span>00:00 (Night)</span>
              <span>12:00 (Noon)</span>
              <span>23:00 (Night)</span>
            </div>
          </div>

          {/* Phase Presets */}
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" />
              Goa Atmosphere Phases:
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {PHASES.map((p) => {
                const active = phase === p.id && isManualOverride
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setManualPhase(p.id)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2 text-center text-xs font-medium transition-all ${
                      active
                        ? "bg-emerald-700 text-white font-bold shadow-md scale-105"
                        : "bg-muted hover:bg-emerald-100/80 text-foreground"
                    }`}
                  >
                    <span className="text-sm">{p.emoji}</span>
                    <span className="mt-0.5 text-[10px] leading-tight">{p.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Reset to Auto Live Time Button */}
          <div className="mt-5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                resetToLiveTime()
                setIsOpen(false)
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all"
            >
              <RotateCcw className="size-3.5" />
              Reset to Automatic Live Time
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
