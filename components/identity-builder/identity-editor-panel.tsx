"use client"

import { useIdentity } from "@/components/identity-builder/identity-context"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import { PhotoCropper } from "@/components/identity-builder/photo-cropper"
import { FRAME_OPTIONS, BUILDER_TITLE_PRESETS, BUILDER_CLASSES } from "@/lib/builder-data"
import { cn } from "@/lib/utils"
import type { GenerateMode } from "@/lib/identity-types"

// Curated subset of frames for simplicity
const PICKED_FRAMES = ["sunset-ring", "ocean-wave", "tropical-leaf", "coastal-glow", "neon-goa", "terminal"]

export function IdentityEditorPanel({ mode }: { mode: GenerateMode }) {
  const { state, dispatch } = useIdentity()
  const { palette } = useGoaTimeContext()
  const member = state.members[0]

  const inputCls = "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 transition-colors"
  const sectionCls = "rounded-2xl border border-border bg-card p-4 shadow-sm"
  const labelCls = "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground"

  return (
    <div className="flex flex-col gap-4">

      {/* ── Photo ── */}
      <div className={sectionCls}>
        <p className={labelCls}>Your Photo</p>
        <PhotoCropper
          photoDataUrl={member.photoDataUrl}
          crop={member.crop}
          label="Your photo"
          onPhotoChange={(url) => dispatch({ type: "SET_MEMBER_PHOTO", memberId: member.id, photoDataUrl: url })}
          onCropChange={(crop) => dispatch({ type: "SET_MEMBER_CROP", memberId: member.id, crop })}
          onCroppedAreaChange={(area) => dispatch({ type: "SET_MEMBER_CROPPED_AREA", memberId: member.id, area })}
        />
      </div>

      {/* ── Name ── */}
      {mode !== "pfp" && (
        <div className={sectionCls}>
          <label className={labelCls}>Your Name</label>
          <input
            value={member.name}
            onChange={(e) => dispatch({ type: "SET_MEMBER_NAME", memberId: member.id, name: e.target.value })}
            placeholder="YOUR NAME"
            maxLength={24}
            className={inputCls}
          />
        </div>
      )}

      {/* ── Team Name (Builder ID only) ── */}
      {mode === "builder-id" && (
        <div className={sectionCls}>
          <label className={labelCls}>Team Name</label>
          <input
            value={state.teamName}
            onChange={(e) => dispatch({ type: "SET_TEAM_NAME", teamName: e.target.value.toUpperCase() })}
            placeholder="E.G. SOLO BUILDER, COCONUT CODERS"
            maxLength={28}
            className={inputCls}
          />
        </div>
      )}

      {/* ── Stack / Role (Builder ID only) ── */}
      {mode === "builder-id" && (
        <div className={sectionCls}>
          <label className={labelCls}>Stack / Role</label>
          <input
            value={state.stackLine}
            onChange={(e) => dispatch({ type: "SET_STACK_LINE", stackLine: e.target.value })}
            placeholder="FULL STACK / HACKER"
            maxLength={32}
            className={inputCls}
          />
        </div>
      )}

      {/* ── Builder Class (Builder ID only) ── */}
      {mode === "builder-id" && (
        <div className={sectionCls}>
          <p className={labelCls}>Access Level</p>
          <div className="flex flex-wrap gap-2">
            {BUILDER_CLASSES.map((cls) => {
              const active = member.builderClass === cls
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => dispatch({ type: "SET_MEMBER_CLASS", memberId: member.id, builderClass: cls })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                    active ? "text-white border-transparent" : "border-border text-muted-foreground hover:bg-muted"
                  )}
                  style={active ? { backgroundColor: palette.accent } : undefined}
                >
                  {cls}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Builder Title ── */}
      {mode !== "pfp" && (
        <div className={sectionCls}>
          <p className={labelCls}>Builder Title</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {BUILDER_TITLE_PRESETS.map((preset) => {
              const active = state.title === preset.toUpperCase()
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => dispatch({ type: "SET_TITLE", title: active ? "" : preset })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] font-semibold transition-all",
                    active ? "text-white border-transparent" : "border-border text-muted-foreground hover:bg-muted"
                  )}
                  style={active ? { backgroundColor: palette.accent } : undefined}
                >
                  {preset}
                </button>
              )
            })}
          </div>
          <input
            value={state.title}
            onChange={(e) => dispatch({ type: "SET_TITLE", title: e.target.value })}
            placeholder="OR TYPE A CUSTOM TITLE"
            maxLength={28}
            className={inputCls}
          />
        </div>
      )}

      {/* ── Frame Picker ── */}
      <div className={sectionCls}>
        <p className={labelCls}>Frame Ring</p>
        <div className="flex flex-wrap gap-3">
          {FRAME_OPTIONS.filter(f => PICKED_FRAMES.includes(f.id)).map((frame) => {
            const active = state.frameId === frame.id
            return (
              <button
                key={frame.id}
                type="button"
                title={frame.name}
                onClick={() => dispatch({ type: "SET_FRAME", frameId: frame.id })}
                className="relative flex flex-col items-center gap-1"
              >
                <div
                  className="size-12 rounded-full transition-transform hover:scale-110"
                  style={{
                    background: `conic-gradient(from 90deg, ${frame.colors[0]}, ${frame.colors[1]}, ${frame.colors[0]})`,
                    padding: 3,
                    outline: active ? `3px solid ${palette.accent}` : "3px solid transparent",
                    outlineOffset: 2,
                  }}
                >
                  <div className="size-full rounded-full bg-background border border-border/20" />
                </div>
                <span className={cn("text-[9px] font-semibold text-center w-14 leading-tight",
                  active ? "text-foreground" : "text-muted-foreground")}>
                  {frame.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
