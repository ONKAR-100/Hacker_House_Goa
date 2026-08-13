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

  const inputCls = "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold uppercase outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 transition-colors"
  const sectionCls = "rounded-2xl border border-border bg-card p-4 shadow-sm"
  const labelCls = "mb-2 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground"

  if (mode === "team-id") {
    return (
      <div className="flex flex-col gap-4">
        {/* ── Squad Size Selector (Solo, Duo, Trio) ── */}
        <div className={sectionCls}>
          <p className={labelCls}>Squad Size</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "solo", label: "Solo", icon: "👤", desc: "1 Member" },
              { id: "duo", label: "Duo", icon: "👥", desc: "2 Members" },
              { id: "trio", label: "Trio", icon: "👨‍👦‍👧", desc: "3 Members" },
            ].map((t) => {
              const active = state.idType === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => dispatch({ type: "SET_ID_TYPE", idType: t.id as "solo" | "duo" | "trio" })}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all",
                    active ? "border-transparent text-white font-bold shadow-md" : "border-border text-foreground hover:bg-muted"
                  )}
                  style={active ? { backgroundColor: palette.accent } : undefined}
                >
                  <span className="text-base">{t.icon}</span>
                  <span className="text-xs font-bold mt-0.5">{t.label}</span>
                  <span className="text-[10px] opacity-80">{t.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Team Name ── */}
        <div className={sectionCls}>
          <label className={labelCls}>Team / Squad Name</label>
          <input
            value={state.teamName}
            onChange={(e) => dispatch({ type: "SET_TEAM_NAME", teamName: e.target.value })}
            placeholder="E.G. MONSOON HACKERS"
            maxLength={32}
            className={inputCls}
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Appears at the top of your official Team Pass.</p>
        </div>

        {/* ── Team Members (Leader + Members) ── */}
        {state.members.map((m, idx) => {
          const isLeader = idx === 0
          const titleLabel = isLeader ? "Leader / Captain" : `Member ${idx + 1}`
          return (
            <div key={m.id} className={cn(sectionCls, isLeader && "border-emerald-300 bg-emerald-50/20")}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <span className="rounded-full bg-emerald-700 text-white px-2 py-0.5 text-[10px]">
                    {isLeader ? "CAPTAIN" : `MEMBER ${idx + 1}`}
                  </span>
                  {titleLabel}
                </span>
              </div>

              {/* Photo */}
              <div className="mb-3">
                <PhotoCropper
                  photoDataUrl={m.photoDataUrl}
                  crop={m.crop}
                  label={`${titleLabel} Photo`}
                  onPhotoChange={(url) => dispatch({ type: "SET_MEMBER_PHOTO", memberId: m.id, photoDataUrl: url })}
                  onCropChange={(crop) => dispatch({ type: "SET_MEMBER_CROP", memberId: m.id, crop })}
                  onCroppedAreaChange={(area) => dispatch({ type: "SET_MEMBER_CROPPED_AREA", memberId: m.id, area })}
                />
              </div>

              {/* Name */}
              <div className="mb-3">
                <label className={labelCls}>{titleLabel} Name</label>
                <input
                  value={m.name}
                  onChange={(e) => dispatch({ type: "SET_MEMBER_NAME", memberId: m.id, name: e.target.value })}
                  placeholder={isLeader ? "LEADER NAME" : `MEMBER ${idx + 1} NAME`}
                  maxLength={24}
                  className={inputCls}
                />
              </div>

              {/* Role / Class */}
              <div>
                <p className={labelCls}>Role / Builder Class</p>
                <div className="flex flex-wrap gap-1.5">
                  {BUILDER_CLASSES.map((cls) => {
                    const active = m.builderClass === cls
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => dispatch({ type: "SET_MEMBER_CLASS", memberId: m.id, builderClass: cls })}
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-all",
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
            </div>
          )
        })}

        {/* ── Squad Title ── */}
        <div className={sectionCls}>
          <p className={labelCls}>Squad Title Badge</p>
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
            placeholder="E.G. GOA CHAMPIONS"
            maxLength={28}
            className={inputCls}
          />
        </div>

        {/* ── Frame Ring ── */}
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
