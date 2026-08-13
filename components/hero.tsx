"use client"

import { useGoaTimeContext } from "@/components/goa-time-provider"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"

export function Hero() {
  const { palette, isDay, localTimeLabel, countdownLabel, reducedMotion } = useGoaTimeContext()

  const stars = Array.from({ length: 40 }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 53) % 60,
    delay: (i % 10) * 0.4,
    size: (i % 3) + 1,
  }))

  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden pt-24"
      style={{
        background: `linear-gradient(180deg, ${palette.skyTop} 0%, ${palette.skyBottom} 55%, ${palette.oceanTop} 68%, ${palette.oceanBottom} 100%)`,
        transition: "background 3s linear",
      }}
    >
      {/* Stars — fade in at night */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-[3000ms]"
        style={{ opacity: isDay ? 0 : 0.9 }}
      >
        {stars.map((s, i) => (
          <span
            key={i}
            className={reducedMotion ? "" : "goa-motion"}
            style={{
              position: "absolute",
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size * 2,
              height: s.size * 2,
              borderRadius: "50%",
              background: palette.particle,
              animation: reducedMotion ? undefined : `goa-twinkle ${3 + s.delay}s ease-in-out ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Sun / Moon disc */}
      <div
        className="pointer-events-none absolute left-1/2 h-28 w-28 -translate-x-1/2 rounded-full transition-all duration-[3000ms] sm:h-40 sm:w-40"
        style={{
          top: isDay ? "14%" : "10%",
          background: palette.sunMoonColor,
          boxShadow: `0 0 90px 30px ${palette.sunMoonGlow}88, 0 0 200px 80px ${palette.sunMoonGlow}44`,
        }}
      />

      {/* Ocean waves */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden opacity-80">
        <div
          className={reducedMotion ? "absolute inset-x-0 bottom-0 h-full w-[200%]" : "absolute inset-x-0 bottom-0 h-full w-[200%] goa-motion"}
          style={{
            animation: reducedMotion ? undefined : "goa-wave 9s linear infinite",
          }}
        >
          <svg viewBox="0 0 1440 120" className="h-full w-full" preserveAspectRatio="none">
            <path
              d="M0,60 C120,100 240,20 360,60 C480,100 600,20 720,60 C840,100 960,20 1080,60 C1200,100 1320,20 1440,60 L1440,120 L0,120 Z M1440,60 C1560,100 1680,20 1800,60 C1920,100 2040,20 2160,60 C2280,100 2400,20 2520,60 C2640,100 2760,20 2880,60 L2880,120 L1440,120 Z"
              fill={palette.oceanTop}
              opacity={0.7}
            />
          </svg>
        </div>
      </div>

      {/* Palm silhouettes — multiply-blended so the white backing disappears into the sky */}
      <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 mix-blend-multiply sm:h-72 sm:w-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/palm-cluster.png" alt="" className="h-full w-full object-contain object-bottom" />
      </div>
      <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 scale-x-[-1] mix-blend-multiply sm:h-64 sm:w-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/palm-cluster.png" alt="" className="h-full w-full object-contain object-bottom" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <span
          className="rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm"
          style={{ borderColor: `${palette.accent}66`, color: palette.accent, background: "rgba(11,14,26,0.4)" }}
        >
          {palette.label} · {localTimeLabel} IST
        </span>
        <h1 className="font-display text-balance text-5xl font-extrabold leading-[1.05] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:text-6xl md:text-7xl">
          Build Your ID.
          <br />
          Frame Your Goa Story.
        </h1>
        <p className="max-w-xl text-pretty text-base text-white/85 sm:text-lg">
          HH Goa 2026 — upload your photo, pick a frame, stack your badges, and ship a Builder ID that lives and
          breathes with the Goa sky. Solo, Duo, or full Trio squad.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            render={<a href="#build" />}
            nativeButton={false}
            size="lg"
            className="rounded-full px-8 text-base font-bold shadow-xl transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #FF6B5E 0%, #FFC857 100%)",
              color: "#164A41",
              boxShadow: "0 4px 20px rgba(255, 107, 94, 0.4)",
            }}
          >
            Start Building
            <ArrowDown data-icon="inline-end" className="size-4" />
          </Button>
          <span className="text-xs font-medium text-white/70">{countdownLabel} · Goa, India</span>
        </div>
      </div>

      {/* Fade to page background */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </section>
  )
}
