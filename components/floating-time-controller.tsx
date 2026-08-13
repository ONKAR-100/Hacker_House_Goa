"use client"

import { useState } from "react"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import { Clock, RotateCcw, Sliders, X, Sparkles, Sun, Moon } from "lucide-react"
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

export function FloatingTimeController() {
  const {
    now,
    phase,
    localTimeLabel,
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Control Modal */}
      {isOpen && (
        <div
          className="mb-3 w-80 max-w-[90vw] rounded-2xl border border-border bg-card p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200"
          style={{ borderColor: palette.accent }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-emerald-600" />
              <div>
                <h3 className="font-display text-sm font-bold text-foreground">Time & Animation Dial</h3>
                <p className="text-[10px] text-muted-foreground">Test sky, sun, wave & pass animations</p>
              </div>
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
              <span className="text-muted-foreground flex items-center gap-1">
                {isDay ? <Sun className="size-3.5 text-amber-500" /> : <Moon className="size-3.5 text-teal-500" />}
                Manual Time:
              </span>
              <span className="font-mono text-emerald-700 font-bold text-sm">
                {String(currentHour).padStart(2, "0")}:00 IST
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={currentHour}
              onChange={(e) => setManualHour(parseInt(e.target.value, 10))}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-lg bg-emerald-100 accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
              <span>00:00 (Midnight)</span>
              <span>12:00 (Noon)</span>
              <span>23:00 (Night)</span>
            </div>
          </div>

          {/* Phase Quick-Pills */}
          <div className="mt-4 flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" />
              Atmosphere Presets:
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

          {/* Reset to Auto Button */}
          <div className="mt-5 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={resetToLiveTime}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-md ${
                isManualOverride
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                  : "bg-muted text-muted-foreground opacity-60 cursor-default"
              }`}
              disabled={!isManualOverride}
            >
              <RotateCcw className="size-3.5" />
              {isManualOverride ? "Reset to Automatic Live Time" : "Live Auto Time Active"}
            </button>
          </div>
        </div>
      )}

      {/* Floating Side Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-border bg-emerald-800/90 px-4 py-2.5 text-xs font-bold text-white shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:bg-emerald-800"
        style={{
          boxShadow: `0 4px 20px ${palette.accent}44`,
        }}
      >
        <Clock className="size-4 animate-spin-slow text-amber-300" />
        <span>{localTimeLabel}</span>
        {isManualOverride ? (
          <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
            Manual
          </span>
        ) : (
          <Sliders className="size-3.5 text-teal-200" />
        )}
      </button>
    </div>
  )
}
