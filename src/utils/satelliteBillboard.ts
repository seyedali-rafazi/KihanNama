import type { SatelliteInfo } from '../types/globe'

const RENDER_SIZE = 96
export const SATELLITE_BILLBOARD_DISPLAY_SIZE = 48
const BORDER = 3.5

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function drawStarfield(ctx: CanvasRenderingContext2D, satId: string, radius: number) {
  const cx = RENDER_SIZE / 2
  const cy = RENDER_SIZE / 2
  const seed = hashString(satId)

  for (let i = 0; i < 14; i++) {
    const angle = ((seed + i * 47) % 360) * (Math.PI / 180)
    const dist = radius * (0.25 + (((seed >> i) & 7) / 10))
    const x = cx + Math.cos(angle) * dist
    const y = cy + Math.sin(angle) * dist
    const starSize = 0.6 + ((seed + i) % 3) * 0.35
    const alpha = 0.18 + ((seed + i * 3) % 5) * 0.08

    ctx.beginPath()
    ctx.arc(x, y, starSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.fill()
  }
}

function drawSolarPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height)
  gradient.addColorStop(0, '#1a365d')
  gradient.addColorStop(0.45, '#2c5282')
  gradient.addColorStop(1, '#1a202c')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, 2)
  ctx.fill()

  ctx.strokeStyle = 'rgba(147, 197, 253, 0.35)'
  ctx.lineWidth = 0.6
  const cols = 3
  const rows = 2
  for (let col = 1; col < cols; col++) {
    const lineX = x + (width / cols) * col
    ctx.beginPath()
    ctx.moveTo(lineX, y + 1)
    ctx.lineTo(lineX, y + height - 1)
    ctx.stroke()
  }
  for (let row = 1; row < rows; row++) {
    const lineY = y + (height / rows) * row
    ctx.beginPath()
    ctx.moveTo(x + 1, lineY)
    ctx.lineTo(x + width - 1, lineY)
    ctx.stroke()
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.roundRect(x + 0.5, y + 0.5, width - 1, height - 1, 2)
  ctx.stroke()
}

function drawSatelliteArtwork(
  ctx: CanvasRenderingContext2D,
  sat: SatelliteInfo,
  cx: number,
  cy: number,
) {
  const [r, g, b] = sat.color
  const accent = `rgb(${r}, ${g}, ${b})`
  const accentSoft = `rgba(${r}, ${g}, ${b}, 0.55)`

  const glow = ctx.createRadialGradient(cx, cy - 2, 0, cx, cy - 2, 34)
  glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.42)`)
  glow.addColorStop(0.55, `rgba(${r}, ${g}, ${b}, 0.12)`)
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(cx, cy - 2, 34, 0, Math.PI * 2)
  ctx.fill()

  drawSolarPanel(ctx, cx - 36, cy - 5, 18, 10)
  drawSolarPanel(ctx, cx + 18, cy - 5, 18, 10)

  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cx - 18, cy)
  ctx.lineTo(cx - 12, cy)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 12, cy)
  ctx.lineTo(cx + 18, cy)
  ctx.stroke()

  const bodyGradient = ctx.createLinearGradient(cx - 10, cy - 8, cx + 10, cy + 8)
  bodyGradient.addColorStop(0, '#64748b')
  bodyGradient.addColorStop(0.35, '#cbd5e1')
  bodyGradient.addColorStop(0.7, '#94a3b8')
  bodyGradient.addColorStop(1, '#475569')

  ctx.fillStyle = bodyGradient
  ctx.beginPath()
  ctx.roundRect(cx - 11, cy - 7, 22, 14, 3)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.roundRect(cx - 10.2, cy - 6.2, 20.4, 12.4, 2.5)
  ctx.stroke()

  ctx.fillStyle = accentSoft
  ctx.beginPath()
  ctx.roundRect(cx - 4, cy - 2.5, 8, 5, 1.5)
  ctx.fill()

  ctx.strokeStyle = accent
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(cx, cy - 7)
  ctx.lineTo(cx, cy - 16)
  ctx.stroke()

  ctx.fillStyle = '#e2e8f0'
  ctx.beginPath()
  ctx.arc(cx, cy - 17, 2.2, 0, Math.PI * 2)
  ctx.fill()

  const dishGradient = ctx.createRadialGradient(cx, cy - 17, 0, cx, cy - 17, 4.5)
  dishGradient.addColorStop(0, '#f8fafc')
  dishGradient.addColorStop(0.55, '#cbd5e1')
  dishGradient.addColorStop(1, accent)
  ctx.fillStyle = dishGradient
  ctx.beginPath()
  ctx.arc(cx, cy - 17, 4.5, Math.PI, 0)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(cx, cy + 5.5, 1.6, 0, Math.PI * 2)
  ctx.fill()
}

function drawDefaultArtwork(
  ctx: CanvasRenderingContext2D,
  sat: SatelliteInfo,
  innerRadius: number,
) {
  const [r, g, b] = sat.color
  const cx = RENDER_SIZE / 2
  const cy = RENDER_SIZE / 2

  const background = ctx.createRadialGradient(cx, cy - 6, innerRadius * 0.1, cx, cy, innerRadius)
  background.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.28)`)
  background.addColorStop(0.42, '#12151c')
  background.addColorStop(1, '#07090d')

  ctx.fillStyle = background
  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2)
  ctx.fill()

  const horizon = ctx.createLinearGradient(cx, cy + innerRadius * 0.35, cx, cy + innerRadius)
  horizon.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.08)`)
  horizon.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.28)`)
  ctx.fillStyle = horizon
  ctx.beginPath()
  ctx.ellipse(cx, cy + innerRadius * 0.72, innerRadius * 0.82, innerRadius * 0.28, 0, 0, Math.PI * 2)
  ctx.fill()

  drawStarfield(ctx, sat.id, innerRadius)
  drawSatelliteArtwork(ctx, sat, cx, cy + 1)
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  innerRadius: number,
) {
  const diameter = innerRadius * 2
  const scale = Math.max(diameter / img.width, diameter / img.height)
  const width = img.width * scale
  const height = img.height * scale
  const x = (RENDER_SIZE - width) / 2
  const y = (RENDER_SIZE - height) / 2

  ctx.drawImage(img, x, y, width, height)

  const cx = RENDER_SIZE / 2
  const cy = RENDER_SIZE / 2
  const shade = ctx.createRadialGradient(cx, cy, innerRadius * 0.35, cx, cy, innerRadius)
  shade.addColorStop(0, 'rgba(0, 0, 0, 0)')
  shade.addColorStop(1, 'rgba(0, 0, 0, 0.35)')
  ctx.fillStyle = shade
  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2)
  ctx.fill()
}

export async function createSatelliteBillboardCanvas(sat: SatelliteInfo): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = RENDER_SIZE
  canvas.height = RENDER_SIZE

  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const [r, g, b] = sat.color
  const cx = RENDER_SIZE / 2
  const cy = RENDER_SIZE / 2
  const innerRadius = RENDER_SIZE / 2 - BORDER - 1.5

  ctx.clearRect(0, 0, RENDER_SIZE, RENDER_SIZE)

  ctx.beginPath()
  ctx.arc(cx, cy, RENDER_SIZE / 2 - 1, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.18)`
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2)
  ctx.clip()

  const photo = sat.image?.trim() ? await loadImage(sat.image) : null
  if (photo) {
    drawCoverImage(ctx, photo, innerRadius)
  } else {
    drawDefaultArtwork(ctx, sat, innerRadius)
  }
  ctx.restore()

  const ringGradient = ctx.createLinearGradient(cx - innerRadius, cy - innerRadius, cx + innerRadius, cy + innerRadius)
  ringGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`)
  ringGradient.addColorStop(0.5, `rgba(255, 255, 255, 0.85)`)
  ringGradient.addColorStop(1, `rgb(${r}, ${g}, ${b})`)

  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius + BORDER / 2, 0, Math.PI * 2)
  ctx.strokeStyle = ringGradient
  ctx.lineWidth = BORDER
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius + BORDER / 2 + 1.2, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1
  ctx.stroke()

  return canvas
}

