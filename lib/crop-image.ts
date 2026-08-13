export interface PixelCrop {
  x: number
  y: number
  width: number
  height: number
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", (err) => reject(err))
    img.src = url
  })
}

/**
 * Draws the cropped + rotated region of `imageSrc` onto an offscreen canvas
 * and returns a square PNG data URL at `outputSize` px, ready to composite
 * into the Builder ID card.
 */
export async function getCroppedImageDataUrl(
  imageSrc: string,
  crop: PixelCrop,
  rotation = 0,
  outputSize = 512
): Promise<string> {
  const image = await createImage(imageSrc)

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Could not get canvas context")

  canvas.width = outputSize
  canvas.height = outputSize

  ctx.save()
  if (rotation !== 0) {
    ctx.translate(outputSize / 2, outputSize / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-outputSize / 2, -outputSize / 2)
  }

  const cropX = crop && typeof crop.x === "number" ? crop.x : 0
  const cropY = crop && typeof crop.y === "number" ? crop.y : 0
  const cropW = crop && typeof crop.width === "number" && crop.width > 0 ? crop.width : image.width
  const cropH = crop && typeof crop.height === "number" && crop.height > 0 ? crop.height : image.height

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropW,
    cropH,
    0,
    0,
    outputSize,
    outputSize
  )
  ctx.restore()

  return canvas.toDataURL("image/png")
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
