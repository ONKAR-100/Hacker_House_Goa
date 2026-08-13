"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Download, RefreshCw, ImageIcon, IdCard, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import { renderPfp, renderBuilderId, renderTeamId } from "@/lib/canvas-render"
import { cn } from "@/lib/utils"
import type { GenerateMode } from "@/lib/identity-types"

type Tab = GenerateMode

const TABS: { id: Tab; label: string; icon: typeof ImageIcon }[] = [
  { id: "pfp", label: "PFP", icon: ImageIcon },
  { id: "builder-id", label: "Solo ID", icon: IdCard },
  { id: "team-id", label: "Team ID", icon: Users },
]

export function LivePreviewPanel() {
  const { state } = useIdentity()
  const { palette } = useGoaTimeContext()
  const [activeTab, setActiveTab] = useState<Tab>(state.generateMode)
  const [rendering, setRendering] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderCountRef = useRef(0)

  const paletteForRender = {
    accent: palette.accent,
    skyTop: palette.skyTop,
    skyBottom: palette.skyBottom,
    sunMoonColor: palette.sunMoonColor,
  }

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderId = ++renderCountRef.current
    setRendering(true)
    try {
      if (activeTab === "pfp") {
        await renderPfp(canvas, state, renderId, renderCountRef)
      } else if (activeTab === "team-id") {
        await renderTeamId(canvas, state, paletteForRender, renderId, renderCountRef)
      } else {
        await renderBuilderId(canvas, state, paletteForRender, renderId, renderCountRef)
      }
    } catch (err) {
      console.error("Canvas render error:", err)
    } finally {
      if (renderId === renderCountRef.current) {
        setRendering(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, activeTab, palette.accent, palette.skyTop, palette.skyBottom, palette.sunMoonColor])

  // Re-render whenever state or tab changes
  useEffect(() => {
    render()
  }, [render])

  // Sync tab to generateMode when user changes mode
  useEffect(() => {
    setActiveTab(state.generateMode)
  }, [state.generateMode])

  // ── Save as PNG ──
  const handleSave = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const label = activeTab === "pfp" ? "goa-pfp" : "goa-builder-id"
    const link = document.createElement("a")
    link.download = `${label}-${state.passId}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  // ── Share to X ──
  const handleShareX = async () => {
    const canvas = canvasRef.current
    const teamName = state.teamName || "NovaSync"
    const name = state.members[0]?.name || "BUILDER"
    const passId = state.passId || "HH-2026-3363"
    const title = state.title || "HH GOA BUILDER"
    const cls = state.members[0]?.builderClass || "BUILDER"

    const tweetText = 
      `Just generated my HH Goa 2026\n` +
      `Presented by Team ${teamName}\n` +
      `#FrameInGoa`

    let origin = typeof window !== "undefined" ? window.location.origin : "https://hacker-house-goa-rxe4.vercel.app"
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      origin = "https://hacker-house-goa-rxe4.vercel.app"
    }
    const shareUrl = `${origin}/?passId=${encodeURIComponent(passId)}&name=${encodeURIComponent(name)}&team=${encodeURIComponent(teamName)}&mode=${activeTab}&title=${encodeURIComponent(title)}&cls=${encodeURIComponent(cls)}`

    // Copy pass image to clipboard first
    if (canvas) {
      try {
        canvas.toBlob(async (blob) => {
          if (blob) {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
          }
        })
      } catch {
        // ignore
      }
    }

    // Open X (Twitter) Tweet Composer in a new tab
    const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(intentUrl, "_blank")
  }

  // ── Copy to clipboard ──
  const handleCopy = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch {
      // Fallback: just download
      handleSave()
    }
  }

  return (
    <div className="w-full pb-8">
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-foreground">
            Live Preview
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Your output updates in real-time as you customize above.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={render}
          disabled={rendering}
          className="shrink-0"
        >
          <RefreshCw className={cn("size-3.5", rendering && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Tab switcher */}
      <div className="mb-5 flex gap-1.5 rounded-xl border border-border bg-muted p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all",
                active ? "text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              style={active ? { backgroundColor: palette.accent } : undefined}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Canvas preview area */}
      <div
        className="relative flex min-h-[340px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#F7FCF9] to-[#E6F5F0] p-6 shadow-inner"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${palette.accent}08 0%, transparent 60%),
                            radial-gradient(circle at 80% 80%, ${palette.skyTop}0a 0%, transparent 60%)`,
        }}
      >
        {rendering && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/60 backdrop-blur-sm">
            <RefreshCw className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="max-h-[480px] max-w-full rounded-xl object-contain shadow-lg transition-all duration-300"
          style={{
            boxShadow: `0 8px 40px ${palette.accent}22, 0 2px 8px rgba(0,0,0,0.08)`,
          }}
        />
      </div>

      {/* Preview context label */}
      <p className="mt-2 text-center text-xs text-muted-foreground">
        {activeTab === "pfp" && "512 × 512 px · Perfect for profile pictures on any platform"}
        {activeTab === "builder-id" && "480 × 720 px · Shareable Builder ID card"}
      </p>

      {/* Export / Share bar */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {/* Save PNG */}
        <Button
          size="lg"
          onClick={handleSave}
          className="rounded-full px-6 font-bold shadow-md transition-transform hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #FF6B5E 0%, #FFC857 100%)",
            color: "#164A41",
            boxShadow: "0 4px 16px rgba(255, 107, 94, 0.3)",
          }}
        >
          <Download className="size-4" />
          Save as PNG
        </Button>

        {/* Copy to clipboard */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleCopy}
          className="rounded-full px-6 font-semibold"
        >
          {copied ? (
            <>
              <CheckCircle2 className="size-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <ImageIcon className="size-4" />
              Copy Image
            </>
          )}
        </Button>

        {/* Share to X */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleShareX}
          className="rounded-full px-6 font-semibold border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/5"
        >
          <span className="text-base font-black leading-none">𝕏</span>
          Share on X
        </Button>
      </div>

      {/* Tip */}
      <p className="mt-4 text-center text-xs text-muted-foreground">
        💡 Switch tabs to preview PFP, Builder ID, and Team ID simultaneously — all generated from the same customization.
      </p>
    </div>
  )
}
