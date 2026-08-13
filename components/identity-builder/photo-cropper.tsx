"use client"

import { useCallback, useRef, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
import { RotateCcw, Upload, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { readFileAsDataUrl } from "@/lib/crop-image"
import { useGoaTimeContext } from "@/components/goa-time-provider"
import type { CropTransform } from "@/lib/identity-types"

interface PhotoCropperProps {
  photoDataUrl: string | null
  crop: CropTransform
  onPhotoChange: (dataUrl: string | null) => void
  onCropChange: (crop: CropTransform) => void
  onCroppedAreaChange: (area: Area) => void
  label?: string
}

export function PhotoCropper({
  photoDataUrl,
  crop,
  onPhotoChange,
  onCropChange,
  onCroppedAreaChange,
  label = "Your photo",
}: PhotoCropperProps) {
  const { palette } = useGoaTimeContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return
      const dataUrl = await readFileAsDataUrl(file)
      onPhotoChange(dataUrl)
      onCropChange({ x: 0, y: 0, zoom: 1, rotation: 0 })
    },
    [onPhotoChange, onCropChange]
  )

  const currentZoom = typeof crop?.zoom === "number" && !isNaN(crop.zoom) ? crop.zoom : 1
  const currentRotation = typeof crop?.rotation === "number" && !isNaN(crop.rotation) ? crop.rotation : 0

  if (!photoDataUrl) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragActive(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors"
        style={{
          borderColor: dragActive ? palette.accent : "var(--border)",
          backgroundColor: dragActive ? `${palette.accent}0d` : "transparent",
        }}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          <Upload className="size-5 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">Drag & drop or click to upload — JPG, PNG</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
          Choose Photo
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative h-64 w-full overflow-hidden rounded-xl bg-black/80 sm:h-72"
        style={{ outline: `2px solid ${palette.accent}` }}
      >
        <Cropper
          image={photoDataUrl}
          crop={{ x: crop.x || 0, y: crop.y || 0 }}
          zoom={currentZoom}
          rotation={currentRotation}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={(point) => onCropChange({ ...crop, x: point.x, y: point.y })}
          onZoomChange={(zoom) => {
            if (typeof zoom === "number" && !isNaN(zoom)) {
              onCropChange({ ...crop, zoom })
            }
          }}
          onRotationChange={(rotation) => {
            if (typeof rotation === "number" && !isNaN(rotation)) {
              onCropChange({ ...crop, rotation })
            }
          }}
          onCropComplete={(_area, areaPixels) => onCroppedAreaChange(areaPixels)}
        />
      </div>

      {/* Zoom Control Bar */}
      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2">
        <button
          type="button"
          onClick={() => {
            const newZoom = Math.max(1, currentZoom - 0.1)
            onCropChange({ ...crop, zoom: Number(newZoom.toFixed(2)) })
          }}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xs font-semibold hover:bg-muted transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="size-3.5 text-muted-foreground" />
        </button>

        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={currentZoom}
          onChange={(e) => {
            const val = parseFloat(e.target.value)
            if (!isNaN(val)) {
              onCropChange({ ...crop, zoom: val })
            }
          }}
          className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-primary focus:outline-none"
          style={{ accentColor: palette.accent }}
        />

        <button
          type="button"
          onClick={() => {
            const newZoom = Math.min(3, currentZoom + 0.1)
            onCropChange({ ...crop, zoom: Number(newZoom.toFixed(2)) })
          }}
          className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-xs font-semibold hover:bg-muted transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="size-3.5 text-muted-foreground" />
        </button>

        <span className="w-11 shrink-0 text-right text-xs font-mono font-semibold text-muted-foreground">
          {Math.round(currentZoom * 100)}%
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload data-icon="inline-start" className="size-3.5" />
          Replace Photo
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onCropChange({ x: 0, y: 0, zoom: 1, rotation: 0 })}
        >
          <RotateCcw data-icon="inline-start" className="size-3.5" />
          Reset
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  )
}
