import type { IdentityState } from "@/lib/identity-types"
import { getCroppedImageDataUrl } from "@/lib/crop-image"
import { FRAME_OPTIONS } from "@/lib/builder-data"

export interface RenderPalette {
  accent: string
  skyTop: string
  skyBottom: string
  sunMoonColor: string
}

// ── Image Preloader ──────────────────────────────────────────────────────────

export async function loadMemberPhoto(
  member: IdentityState["members"][0] | undefined,
  targetDiameter: number
): Promise<HTMLImageElement | null> {
  if (!member?.photoDataUrl) return null

  try {
    let srcUrl = member.photoDataUrl
    if (member.croppedAreaPixels && member.croppedAreaPixels.width > 0 && member.croppedAreaPixels.height > 0) {
      srcUrl = await getCroppedImageDataUrl(
        member.photoDataUrl,
        member.croppedAreaPixels,
        member.crop?.rotation || 0,
        Math.max(600, targetDiameter)
      )
    }

    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = (err) => reject(err)
      img.src = srcUrl
    })
  } catch (err) {
    console.warn("Failed to prepare member photo:", err)
    // Fallback attempt: load raw data URL directly
    try {
      return await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => resolve(img)
        img.onerror = (err) => reject(err)
        img.src = member.photoDataUrl!
      })
    } catch {
      return null
    }
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/**
 * Synchronously clips and draws the pre-loaded photo inside a circle.
 */
function drawPhotoCircle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  cx: number, cy: number, r: number
) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()

  if (img && img.width > 0 && img.height > 0) {
    const aspect = img.width / img.height
    let dw = r * 2
    let dh = r * 2
    let dx = cx - r
    let dy = cy - r
    if (aspect > 1) {
      dw = r * 2 * aspect
      dx = cx - dw / 2
    } else if (aspect < 1) {
      dh = (r * 2) / aspect
      dy = cy - dh / 2
    }
    ctx.drawImage(img, dx, dy, dw, dh)
  } else {
    drawPhotoPlaceholder(ctx, cx, cy, r)
  }
  ctx.restore()
}

function drawPhotoPlaceholder(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.fillStyle = "#E6F5F0"; ctx.fill()
  // Draw a simple person silhouette (head + shoulders)
  ctx.fillStyle = "#7EDDD3"
  // Head circle
  ctx.beginPath(); ctx.arc(cx, cy - r * 0.15, r * 0.22, 0, Math.PI * 2); ctx.fill()
  // Shoulders arc
  ctx.beginPath(); ctx.arc(cx, cy + r * 0.45, r * 0.38, Math.PI, 0); ctx.fill()
}

function drawFrameRing(ctx: CanvasRenderingContext2D, frameId: string, cx: number, cy: number, r: number, rw: number) {
  const f = FRAME_OPTIONS.find(f => f.id === frameId)
  if (!f) return
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r)
  g.addColorStop(0, f.colors[0]); g.addColorStop(1, f.colors[1])
  ctx.beginPath()
  ctx.arc(cx, cy, r + rw, 0, Math.PI * 2)
  ctx.arc(cx, cy, r, 0, Math.PI * 2, true)
  ctx.closePath()
  ctx.fillStyle = g; ctx.fill()
}

function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  const bars = 42
  const barW = w / bars
  ctx.fillStyle = color
  for (let i = 0; i < bars; i++) {
    if (i % 3 !== 1) {
      const bw = barW * (i % 5 === 0 ? 1.8 : i % 2 === 0 ? 1.2 : 0.7)
      ctx.fillRect(x + i * barW, y, bw, h)
    }
  }
}

function drawCornerSquares(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, margin = 14, size = 8) {
  ctx.fillStyle = color
  ctx.fillRect(margin, margin, size, size)
  ctx.fillRect(W - margin - size, margin, size, size)
  ctx.fillRect(margin, H - margin - size, size, size)
  ctx.fillRect(W - margin - size, H - margin - size, size, size)
}

function dottedBorder(ctx: CanvasRenderingContext2D, W: number, H: number, color: string, margin = 8, r = 14) {
  ctx.save()
  ctx.setLineDash([4, 5])
  ctx.strokeStyle = color; ctx.lineWidth = 2
  rr(ctx, margin, margin, W - margin * 2, H - margin * 2, r)
  ctx.stroke()
  ctx.restore()
}

function fieldLabel(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string) {
  ctx.fillStyle = color; ctx.font = "bold 9px monospace"
  ctx.textAlign = "left"; ctx.textBaseline = "top"
  ctx.fillText(text.toUpperCase(), x, y)
}

function fieldValue(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, maxW: number) {
  ctx.fillStyle = color; ctx.font = "bold 15px sans-serif"
  ctx.textAlign = "left"; ctx.textBaseline = "top"
  let t = text || "—"
  while (ctx.measureText(t).width > maxW && t.length > 1) t = t.slice(0, -1)
  if (t !== text) t += "…"
  ctx.fillText(t, x, y + 12)
}

// ── PFP ──────────────────────────────────────────────────────────────────────

export async function renderPfp(
  canvas: HTMLCanvasElement,
  state: IdentityState,
  renderId?: number,
  currentRenderIdRef?: { current: number }
): Promise<void> {
  const SCALE = 4
  const S = 512
  const r = 220, rw = 20
  const photoImg = await loadMemberPhoto(state.members[0], r * 2 * SCALE)

  // Abort if superseded by another render call
  if (renderId !== undefined && currentRenderIdRef && renderId !== currentRenderIdRef.current) {
    return
  }

  canvas.width = S * SCALE; canvas.height = S * SCALE
  canvas.style.width = `${S}px`; canvas.style.height = `${S}px`
  const ctx = canvas.getContext("2d")!
  ctx.scale(SCALE, SCALE)
  const cx = S / 2, cy = S / 2

  ctx.clearRect(0, 0, S, S)
  ctx.fillStyle = "#FFFFFF"
  ctx.beginPath(); ctx.arc(cx, cy, r + rw + 8, 0, Math.PI * 2); ctx.fill()
  drawFrameRing(ctx, state.frameId, cx, cy, r, rw)
  drawPhotoCircle(ctx, photoImg, cx, cy, r)
}

// ── Drawn decorations (no emojis) ────────────────────────────────────────────

function drawPalmTree(ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number, color: string) {
  ctx.save()
  ctx.strokeStyle = color; ctx.lineCap = "round"
  // trunk
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(x, baseY)
  ctx.quadraticCurveTo(x - 4, baseY - h * 0.5, x + 3, baseY - h)
  ctx.stroke()
  // fronds
  const tx = x + 3, ty = baseY - h
  ctx.lineWidth = 1.8
  for (const deg of [-155, -125, -95, -35, -5, 25]) {
    const rad = (deg * Math.PI) / 180
    const len = h * 0.55
    ctx.beginPath(); ctx.moveTo(tx, ty)
    ctx.quadraticCurveTo(tx + Math.cos(rad) * len * 0.55, ty + Math.sin(rad) * len * 0.55 + 5, tx + Math.cos(rad) * len, ty + Math.sin(rad) * len)
    ctx.stroke()
  }
  ctx.restore()
}

function drawBirds(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineCap = "round"
  for (const [ox, oy, s] of [[0, 0, 1], [14, -4, 0.7], [22, 3, 0.85]] as [number, number, number][]) {
    ctx.beginPath()
    ctx.moveTo(x + ox - 5 * s, y + oy + 2 * s)
    ctx.quadraticCurveTo(x + ox, y + oy, x + ox + 5 * s, y + oy + 2 * s)
    ctx.stroke()
  }
  ctx.restore()
}

function drawWaveLines(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1.2; ctx.lineCap = "round"
  for (let row = 0; row < 2; row++) {
    ctx.beginPath()
    const ry = y + row * 6
    for (let i = 0; i <= w; i += 2) {
      const py = ry + Math.sin((i + row * 20) * 0.08) * 3
      if (i === 0) ctx.moveTo(x + i, py); else ctx.lineTo(x + i, py)
    }
    ctx.stroke()
  }
  ctx.restore()
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save(); ctx.fillStyle = color; ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = (i * 72 - 90) * Math.PI / 180
    const ai = ((i * 72) + 36 - 90) * Math.PI / 180
    if (i === 0) ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    else ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r)
    ctx.lineTo(cx + Math.cos(ai) * r * 0.4, cy + Math.sin(ai) * r * 0.4)
  }
  ctx.closePath(); ctx.fill(); ctx.restore()
}

// ── Builder ID Card ───────────────────────────────────────────────────────────

export async function renderBuilderId(
  canvas: HTMLCanvasElement,
  state: IdentityState,
  palette: RenderPalette,
  renderId?: number,
  currentRenderIdRef?: { current: number }
): Promise<void> {
  const SCALE = 3
  const W = 480, H = 700
  const AVR = 58
  const photoImg = await loadMemberPhoto(state.members[0], AVR * 2 * SCALE)

  // Abort if superseded by another render call
  if (renderId !== undefined && currentRenderIdRef && renderId !== currentRenderIdRef.current) {
    return
  }

  canvas.width = W * SCALE; canvas.height = H * SCALE
  canvas.style.width = `${W}px`; canvas.style.height = `${H}px`
  const ctx = canvas.getContext("2d")!
  ctx.scale(SCALE, SCALE)
  ctx.clearRect(0, 0, W, H)

  const ACCENT = palette.accent
  const CREAM = "#FFFFFF"    // Crisp White card
  const DARK = "#164A41"     // Deep Palm
  const MUTED = "#3B7367"    // Muted mint teal
  const BORDER = "#C8E6DC"   // Light mint border

  // 1. Card background
  rr(ctx, 0, 0, W, H, 18); ctx.fillStyle = CREAM; ctx.fill()

  // 2. Sky gradient header strip
  const skyH = 240
  rr(ctx, 0, 0, W, skyH, 18); ctx.save()
  const sg = ctx.createLinearGradient(0, 0, 0, skyH)
  sg.addColorStop(0, palette.skyTop); sg.addColorStop(1, palette.skyBottom)
  ctx.fillStyle = sg; ctx.fill(); ctx.restore()
  ctx.fillStyle = sg; ctx.fillRect(0, skyH - 18, W, 18)

  // 3. Sun disc (geometric)
  ctx.beginPath(); ctx.arc(W / 2, 70, 32, 0, Math.PI * 2)
  ctx.fillStyle = palette.sunMoonColor
  ctx.shadowColor = palette.sunMoonColor; ctx.shadowBlur = 24; ctx.fill(); ctx.shadowBlur = 0
  // Sun rays
  ctx.save(); ctx.strokeStyle = palette.sunMoonColor + "55"; ctx.lineWidth = 1.5
  for (let i = 0; i < 12; i++) {
    const a = (i * 30) * Math.PI / 180
    ctx.beginPath()
    ctx.moveTo(W / 2 + Math.cos(a) * 36, 70 + Math.sin(a) * 36)
    ctx.lineTo(W / 2 + Math.cos(a) * 44, 70 + Math.sin(a) * 44)
    ctx.stroke()
  }
  ctx.restore()

  // 4. Header text — "[ HH GOA 2026 ]" and "BUILDER ACCESS PASS"
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.font = "bold 13px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "top"
  ctx.fillText("[ HH GOA 2026 ]", W / 2, 22)

  // "BUILDER ACCESS PASS" in larger text without highlight
  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 19px monospace"
  ctx.fillText("BUILDER ACCESS PASS", W / 2, 43)

  // 5. Divider
  ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1; ctx.setLineDash([])
  ctx.beginPath(); ctx.moveTo(32, 70); ctx.lineTo(W - 32, 70); ctx.stroke()

  // 6. Canvas-drawn decorations (no emojis)
  drawPalmTree(ctx, 55, 220, 70, "rgba(255,255,255,0.22)")
  drawPalmTree(ctx, 38, 210, 50, "rgba(255,255,255,0.15)")
  drawPalmTree(ctx, W - 45, 215, 65, "rgba(255,255,255,0.20)")
  drawPalmTree(ctx, W - 65, 222, 45, "rgba(255,255,255,0.13)")
  drawBirds(ctx, 80, 100, "rgba(255,255,255,0.30)")
  drawBirds(ctx, W - 110, 92, "rgba(255,255,255,0.25)")
  drawBirds(ctx, W / 2 - 60, 112, "rgba(255,255,255,0.18)")
  drawWaveLines(ctx, 20, skyH - 14, W - 40, "rgba(255,255,255,0.18)")

  // 7. Avatar ring + photo
  const AVX = W / 2, AVY = 168
  drawFrameRing(ctx, state.frameId, AVX, AVY, AVR, 7)
  drawPhotoCircle(ctx, photoImg, AVX, AVY, AVR)

  // 8. Dotted border + corner squares
  dottedBorder(ctx, W, H, ACCENT)
  drawCornerSquares(ctx, W, H, ACCENT)

  // 9. Info body
  const bTop = 248
  rr(ctx, 16, bTop, W - 32, H - bTop - 16, 14)
  ctx.fillStyle = "white"; ctx.fill()

  let fy = bTop + 18
  const fgap = 52
  const fx = 32, fw = W - 64, hw = fw / 2 - 8

  // Name (full width)
  fieldLabel(ctx, "NAME", fx, fy, MUTED)
  fieldValue(ctx, state.members[0]?.name || "YOUR NAME", fx, fy, DARK, fw)
  fy += fgap

  // Stack/Role (full width)
  fieldLabel(ctx, "STACK / ROLE", fx, fy, MUTED)
  fieldValue(ctx, state.stackLine || "BUILDER / HACKER", fx, fy, DARK, fw)
  fy += fgap

  // Team | Pass ID
  fieldLabel(ctx, "TEAM", fx, fy, MUTED)
  fieldValue(ctx, (state.teamName || "SOLO BUILDER").toUpperCase(), fx, fy, DARK, hw)
  fieldLabel(ctx, "PASS ID", fx + hw + 16, fy, MUTED)
  fieldValue(ctx, state.passId, fx + hw + 16, fy, DARK, hw)
  fy += fgap

  // Access | Issued In
  const cls = (state.members[0]?.builderClass || "BUILDER").toUpperCase()
  fieldLabel(ctx, "ACCESS", fx, fy, MUTED)
  fieldValue(ctx, cls, fx, fy, DARK, hw)
  fieldLabel(ctx, "ISSUED IN", fx + hw + 16, fy, MUTED)
  fieldValue(ctx, "GOA, INDIA", fx + hw + 16, fy, DARK, hw)
  fy += fgap

  // 10. Title badge (no emojis — stars instead)
  if (state.title) {
    const bh = 38, bx = fx, bw2 = fw
    fieldLabel(ctx, "BUILDER TITLE", fx, fy - 14, MUTED)
    rr(ctx, bx, fy, bw2, bh, bh / 2)
    const titleGrad = ctx.createLinearGradient(bx, 0, bx + bw2, 0)
    titleGrad.addColorStop(0, "#FF6B5E")
    titleGrad.addColorStop(1, "#FFC857")
    ctx.fillStyle = titleGrad; ctx.fill()
    ctx.fillStyle = "#164A41"; ctx.font = "bold 13px sans-serif"
    ctx.textAlign = "center"; ctx.textBaseline = "middle"
    const titleText = state.title.toUpperCase()
    ctx.fillText(titleText, W / 2, fy + bh / 2)
    // Draw stars on each side
    drawStar(ctx, bx + 22, fy + bh / 2, 7, "#164A41")
    drawStar(ctx, bx + bw2 - 22, fy + bh / 2, 7, "#164A41")
    fy += bh + 20
  }

  // 11. Divider + barcode
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(32, fy + 2); ctx.lineTo(W - 32, fy + 2); ctx.stroke()
  fy += 12
  drawBarcode(ctx, fx, fy, fw, 28, DARK + "99")

  // Serial
  ctx.fillStyle = MUTED; ctx.font = "9px monospace"
  ctx.textAlign = "center"; ctx.textBaseline = "top"
  ctx.fillText(state.serial, W / 2, H - 20)

  // Card border
  rr(ctx, 0, 0, W, H, 18)
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1.5; ctx.stroke()
}

// ── Horizontal Team ID Pass Renderer ──────────────────────────────────────────

export async function renderTeamId(
  canvas: HTMLCanvasElement,
  state: IdentityState,
  palette: RenderPalette,
  renderId?: number,
  currentRenderIdRef?: { current: number }
): Promise<void> {
  const SCALE = 3
  const W = 680, H = 420
  const count = state.members.length
  const AVR = count === 3 ? 46 : 52

  const photoImgs = await Promise.all(state.members.map((m) => loadMemberPhoto(m, AVR * 2 * SCALE)))

  if (renderId !== undefined && currentRenderIdRef && renderId !== currentRenderIdRef.current) {
    return
  }

  canvas.width = W * SCALE; canvas.height = H * SCALE
  canvas.style.width = `${W}px`; canvas.style.height = `${H}px`
  const ctx = canvas.getContext("2d")!
  ctx.scale(SCALE, SCALE)
  ctx.clearRect(0, 0, W, H)

  const ACCENT = palette.accent
  const CARD_BG = "#FFFFFF"
  const DARK = "#164A41"
  const MUTED = "#3B7367"
  const BORDER = "#C8E6DC"

  // 1. Card Background
  rr(ctx, 0, 0, W, H, 18); ctx.fillStyle = CARD_BG; ctx.fill()

  // 2. Top Sky Panel (Header)
  const skyH = 105
  rr(ctx, 0, 0, W, skyH, 18)
  const sg = ctx.createLinearGradient(0, 0, 0, skyH)
  sg.addColorStop(0, palette.skyTop); sg.addColorStop(1, palette.skyBottom)
  ctx.fillStyle = sg; ctx.fill()
  ctx.fillRect(0, skyH - 15, W, 15)

  // Sun Disc in Header
  const sunX = W / 2, sunY = 52, sunR = 28
  ctx.save()
  ctx.shadowColor = palette.sunMoonColor
  ctx.shadowBlur = 24
  ctx.fillStyle = palette.sunMoonColor
  ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.fill()
  ctx.restore()

  // Sun Rays
  ctx.save()
  ctx.strokeStyle = "rgba(255,255,255,0.4)"
  ctx.lineWidth = 2
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
    const rx1 = sunX + Math.cos(a) * (sunR + 4)
    const ry1 = sunY + Math.sin(a) * (sunR + 4)
    const rx2 = sunX + Math.cos(a) * (sunR + 12)
    const ry2 = sunY + Math.sin(a) * (sunR + 12)
    ctx.beginPath(); ctx.moveTo(rx1, ry1); ctx.lineTo(rx2, ry2); ctx.stroke()
  }
  ctx.restore()

  // Header Canvas Decorations
  drawPalmTree(ctx, 50, 105, 65, "rgba(255,255,255,0.22)")
  drawPalmTree(ctx, 35, 95, 45, "rgba(255,255,255,0.15)")
  drawPalmTree(ctx, W - 45, 100, 60, "rgba(255,255,255,0.20)")
  drawPalmTree(ctx, W - 65, 108, 42, "rgba(255,255,255,0.13)")
  drawBirds(ctx, 90, 40, "rgba(255,255,255,0.30)")
  drawBirds(ctx, W - 110, 35, "rgba(255,255,255,0.25)")
  drawWaveLines(ctx, 20, skyH - 12, W - 40, "rgba(255,255,255,0.18)")

  // Header Text
  ctx.fillStyle = "rgba(255,255,255,0.95)"
  ctx.font = "bold 12px monospace"; ctx.textAlign = "center"; ctx.textBaseline = "top"
  ctx.fillText("[ HH GOA 2026 ]", W / 2, 18)

  ctx.fillStyle = "#FFFFFF"
  ctx.font = "bold 18px monospace"
  ctx.fillText("OFFICIAL TEAM ACCESS PASS", W / 2, 40)

  // Header Divider
  ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(32, 68); ctx.lineTo(W - 32, 68); ctx.stroke()

  // 3. Team Name & Pass ID Banner Below Header
  const bannerY = 118
  // Team Name Pill
  const teamTxt = `TEAM: ${(state.teamName || "MONSOON SQUAD").toUpperCase()}`
  ctx.font = "bold 13px monospace"
  const teamW = ctx.measureText(teamTxt).width + 24
  rr(ctx, 24, bannerY, teamW, 26, 6)
  ctx.fillStyle = "#E6F5F0"; ctx.fill()
  ctx.strokeStyle = "#C8E6DC"; ctx.lineWidth = 1; ctx.stroke()
  ctx.fillStyle = DARK; ctx.textAlign = "left"; ctx.textBaseline = "middle"
  ctx.fillText(teamTxt, 36, bannerY + 13)

  // Pass ID Pill on Right
  const passTxt = `PASS ID: ${state.passId}`
  ctx.font = "bold 11px monospace"
  const passW = ctx.measureText(passTxt).width + 20
  rr(ctx, W - passW - 24, bannerY, passW, 26, 6)
  ctx.fillStyle = DARK; ctx.fill()
  ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "right"; ctx.textBaseline = "middle"
  ctx.fillText(passTxt, W - 34, bannerY + 13)

  // Squad Title Pill (center if set)
  if (state.title) {
    const titleTxt = `⚡ ${state.title.toUpperCase()} ⚡`
    ctx.font = "bold 11px sans-serif"
    const titleW = ctx.measureText(titleTxt).width + 20
    const titleX = (W - titleW) / 2
    rr(ctx, titleX, bannerY, titleW, 26, 13)
    const titleGrad = ctx.createLinearGradient(titleX, 0, titleX + titleW, 0)
    titleGrad.addColorStop(0, "#FF6B5E")
    titleGrad.addColorStop(1, "#FFC857")
    ctx.fillStyle = titleGrad; ctx.fill()
    ctx.fillStyle = DARK; ctx.textAlign = "center"; ctx.textBaseline = "middle"
    ctx.fillText(titleTxt, W / 2, bannerY + 13)
  }

  // 4. Member Columns Section
  const slotW = (W - 32) / count
  const memberStartY = 160

  for (let i = 0; i < count; i++) {
    const m = state.members[i]
    const cX = 16 + slotW * i + slotW / 2

    // Role Label Tag (LEADER for member 0, MEMBER 2 / 3 for rest)
    const roleTag = i === 0 ? "LEADER / CAPTAIN" : `MEMBER ${i + 1}`
    ctx.font = "bold 10px monospace"
    const tagW = ctx.measureText(roleTag).width + 16
    const tagY = memberStartY + 4
    rr(ctx, cX - tagW / 2, tagY, tagW, 18, 4)
    ctx.fillStyle = i === 0 ? "#FF6B5E" : "#E6F5F0"
    ctx.fill()
    ctx.fillStyle = i === 0 ? "#FFFFFF" : DARK
    ctx.textAlign = "center"; ctx.textBaseline = "middle"
    ctx.fillText(roleTag, cX, tagY + 9)

    // PFP Avatar with Ring
    const photoY = memberStartY + 74
    drawFrameRing(ctx, state.frameId, cX, photoY, AVR, 5)
    drawPhotoCircle(ctx, photoImgs[i], cX, photoY, AVR)

    // Member Name (always uppercase)
    const mName = (m?.name || (i === 0 ? "LEADER NAME" : `MEMBER ${i + 1}`)).toUpperCase()
    ctx.fillStyle = DARK
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "center"; ctx.textBaseline = "top"
    
    // Truncate name if too long for column slot
    let displayMName = mName
    while (ctx.measureText(displayMName).width > slotW - 20 && displayMName.length > 2) {
      displayMName = displayMName.slice(0, -1)
    }
    if (displayMName.length < mName.length) displayMName += "…"
    ctx.fillText(displayMName, cX, photoY + AVR + 10)

    // Member Class / Role Pill
    const mClass = (m?.builderClass || "BUILDER").toUpperCase()
    ctx.font = "600 10px sans-serif"
    const classW = ctx.measureText(mClass).width + 14
    const classY = photoY + AVR + 30
    rr(ctx, cX - classW / 2, classY, classW, 18, 9)
    ctx.fillStyle = `${ACCENT}18`; ctx.fill()
    ctx.strokeStyle = `${ACCENT}55`; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = ACCENT; ctx.textAlign = "center"; ctx.textBaseline = "middle"
    ctx.fillText(mClass, cX, classY + 9)
  }

  // 5. Footer Bar
  const footerY = H - 45
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath(); ctx.moveTo(24, footerY); ctx.lineTo(W - 24, footerY); ctx.stroke()
  ctx.setLineDash([])

  // Barcode on Left
  drawBarcode(ctx, 24, footerY + 10, 180, 20, DARK + "aa")

  // Issued & Serial Info on Right
  ctx.fillStyle = MUTED
  ctx.font = "10px monospace"; ctx.textAlign = "right"; ctx.textBaseline = "middle"
  ctx.fillText(`GOA, INDIA · SERIAL: ${state.serial}`, W - 24, footerY + 20)

  // 6. Dotted Outer Border & Corner Squares
  dottedBorder(ctx, W, H, ACCENT)
  drawCornerSquares(ctx, W, H, ACCENT)

  // 7. Outer Card Border
  rr(ctx, 0, 0, W, H, 18)
  ctx.strokeStyle = BORDER; ctx.lineWidth = 1.5; ctx.stroke()
}
