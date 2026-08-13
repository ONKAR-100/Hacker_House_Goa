"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Download, RefreshCw, ImageIcon, IdCard, Users, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import { IdentityEditorPanel } from "@/components/identity-builder/identity-editor-panel"
import { renderPfp, renderBuilderId, renderTeamId } from "@/lib/canvas-render"
import type { GenerateMode } from "@/lib/identity-types"

const MODES: { id: GenerateMode; label: string; icon: typeof ImageIcon; desc: string }[] = [
  { id: "pfp", label: "Profile Pic", icon: ImageIcon, desc: "Circle avatar for any platform" },
  { id: "builder-id", label: "Solo Builder ID", icon: IdCard, desc: "Full vertical access pass" },
  { id: "team-id", label: "Team Pass ID", icon: Users, desc: "Horizontal Squad Pass for Solo, Duo & Trio" },
]

export function IdentityBuilderLayout() {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()
  const [mode, setMode] = useState<GenerateMode>(state.generateMode)
  const [rendering, setRendering] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderCountRef = useRef(0)

  // Sync mode with state.generateMode
  useEffect(() => {
    setMode(state.generateMode)
  }, [state.generateMode])

  const pal = { accent: palette.accent, skyTop: palette.skyTop, skyBottom: palette.skyBottom, sunMoonColor: palette.sunMoonColor }

  const render = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const renderId = ++renderCountRef.current
    setRendering(true)
    try {
      if (mode === "pfp") await renderPfp(canvas, state, renderId, renderCountRef)
      else if (mode === "team-id") await renderTeamId(canvas, state, pal, renderId, renderCountRef)
      else await renderBuilderId(canvas, state, pal, renderId, renderCountRef)
    } catch (e) { console.error(e) }
    finally {
      if (renderId === renderCountRef.current) {
        setRendering(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, mode, palette.accent, palette.skyTop, palette.skyBottom, palette.sunMoonColor])

  useEffect(() => { render() }, [render])

  const switchMode = (m: GenerateMode) => {
    setMode(m)
    dispatch({ type: "SET_GENERATE_MODE", mode: m })
  }

  const handleSave = () => {
    const canvas = canvasRef.current; if (!canvas) return
    const a = document.createElement("a")
    a.download = `hh-goa-${mode}-${state.passId}.png`
    a.href = canvas.toDataURL("image/png"); a.click()
  }

  const handleCopy = () => {
    const canvas = canvasRef.current; if (!canvas) return
    canvas.toBlob(async (blob) => {
      if (!blob) return
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        setCopied(true); setTimeout(() => setCopied(false), 2000)
      } catch { handleSave() }
    })
  }

  const handleShareX = () => {
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
    const shareUrl = `${origin}/?passId=${encodeURIComponent(passId)}&name=${encodeURIComponent(name)}&team=${encodeURIComponent(teamName)}&mode=${mode}&title=${encodeURIComponent(title)}&cls=${encodeURIComponent(cls)}`

    // Directly open X (Twitter) Tweet Composer in a new tab
    const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(intentUrl, "_blank")

    // Background: copy pass image to clipboard for convenient pasting if desired
    if (canvas) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
            setCopied(true)
            setTimeout(() => setCopied(false), 3000)
          } catch {
            // ignore
          }
        }
      })
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Mode selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODES.map(({ id, label, icon: Icon, desc }) => {
          const active = mode === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => switchMode(id)}
              className={cn(
                "flex flex-col items-start gap-1.5 rounded-2xl border-2 p-4 text-left transition-all duration-200",
                active ? "shadow-md" : "border-border bg-card hover:shadow-sm"
              )}
              style={active ? { borderColor: palette.accent, backgroundColor: `${palette.accent}0e` } : undefined}
            >
              <div
                className="flex size-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: active ? palette.accent : "var(--muted)" }}
              >
                <Icon className="size-4" style={{ color: active ? "white" : "var(--muted-foreground)" }} />
              </div>
              <span className="font-display text-sm font-bold text-foreground">{label}</span>
              <span className="text-[11px] text-muted-foreground leading-tight">{desc}</span>
            </button>
          )
        })}
      </div>

      {/* Split layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">

        {/* Left: Editor */}
        <div className="flex flex-col gap-0">
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold text-foreground">Customize</h3>
            <p className="text-sm text-muted-foreground">Changes reflect live in the preview →</p>
          </div>
          <IdentityEditorPanel mode={mode} />
        </div>

        {/* Right: Live Preview (sticky on desktop) */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">Preview</h3>
              <p className="text-xs text-muted-foreground">
                {mode === "pfp" && "512 × 512 px"}
                {mode === "builder-id" && "480 × 700 px"}
              </p>
            </div>
            <button
              onClick={render}
              disabled={rendering}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <RefreshCw className={cn("size-3", rendering && "animate-spin")} />
              Refresh
            </button>
          </div>

          {/* Canvas area */}
          <div
            className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-border p-4"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, ${palette.accent}0a, transparent 60%),
                           radial-gradient(ellipse at 70% 80%, ${palette.skyTop}0d, transparent 60%),
                           linear-gradient(135deg, #F7FCF9 0%, #E6F5F0 100%)`,
            }}
          >
            {rendering && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl">
                <RefreshCw className="size-7 animate-spin text-muted-foreground" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              className="max-h-[460px] max-w-full rounded-xl object-contain transition-all"
              style={{ boxShadow: `0 6px 32px ${palette.accent}20, 0 2px 8px rgba(0,0,0,0.06)` }}
            />
          </div>

          {/* Export bar */}
          <div className="mt-4 flex flex-col gap-2">
            <Button
              className="w-full rounded-xl font-semibold"
              style={{ backgroundColor: palette.accent, color: "white" }}
              onClick={handleSave}
            >
              <Download className="size-4" />
              Save as PNG
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="rounded-xl font-semibold" onClick={handleCopy}>
                {copied ? <><CheckCircle2 className="size-4 text-green-500" />Copied!</> : <><ImageIcon className="size-4" />Copy</>}
              </Button>
              <Button variant="outline" className="rounded-xl font-semibold" onClick={handleShareX}>
                <span className="font-black">𝕏</span> Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
