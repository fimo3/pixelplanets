"use client"
import { useEffect, useRef, useState } from "react"
import Noise from "noisejs"

type Props = {
  seed: string
  color: string
  terrain: string
  land_color: string
  liquid_percent?: number
  liquid_color?: string
}

export default function PlanetCanvas({
  seed,
  color,
  terrain,
  land_color = "#888888",
  liquid_percent = 30,
  liquid_color = "#1E90FF",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationFrame, setAnimationFrame] = useState(0)
  const animationRef = useRef<number | null>(null)
  const terrainCache = useRef<ImageData | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create seeded noise generator
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }
    const noise = new Noise.Noise(hash / 10000)

    const size = canvas.width
    const radius = size / 2
    const center = { x: size / 2, y: size / 2 }

    const terrainConfig: Record<string, { scale: number; contrast: number }> = {
      rocky: { scale: 0.05, contrast: 1.3 },
      icy: { scale: 0.03, contrast: 0.7 },
      jungle: { scale: 0.06, contrast: 1.0 },
      desert: { scale: 0.04, contrast: 1.2 },
      gaseous: { scale: 0.02, contrast: 0.5 },
    }

    const config = terrainConfig[terrain.toLowerCase()] || {
      scale: 0.04,
      contrast: 1.0,
    }

    // Generate terrain only once and cache it
    if (!terrainCache.current) {
      const imageData = ctx.createImageData(size, size)
      const landRgb = hexToRgb(land_color)
      const liquidRgb = hexToRgb(liquid_color)

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - center.x
          const dy = y - center.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > radius) continue

          const n = noise.simplex2(x * config.scale, y * config.scale)
          let brightness = (n + 1) / 2
          brightness = Math.pow(brightness, config.contrast)

          const isLiquid = n < liquid_percent / 100 - 0.5

          const index = (y * size + x) * 4
          if (isLiquid) {
            imageData.data[index] = liquidRgb.r
            imageData.data[index + 1] = liquidRgb.g
            imageData.data[index + 2] = liquidRgb.b
            imageData.data[index + 3] = 255
          } else {
            imageData.data[index] = landRgb.r * brightness
            imageData.data[index + 1] = landRgb.g * brightness
            imageData.data[index + 2] = landRgb.b * brightness
            imageData.data[index + 3] = 255
          }
        }
      }
      terrainCache.current = imageData
    }

    const renderFrame = (frame: number) => {
      if (!ctx || !terrainCache.current) return

      // Clear and draw terrain
      ctx.clearRect(0, 0, size, size)
      ctx.putImageData(terrainCache.current, 0, 0)

      // Cloud parameters - adjusted for larger clouds
      const cloudScale = 0.03 // Smaller scale = bigger cloud formations
      const cloudSpeed = 0.002
      const cloudThreshold = 0.2 // Lower threshold = more expansive clouds
      const timeOffset = frame * cloudSpeed

      // Create cloud canvas
      const cloudCanvas = document.createElement("canvas")
      cloudCanvas.width = size
      cloudCanvas.height = size
      const cloudCtx = cloudCanvas.getContext("2d")
      if (!cloudCtx) return

      // Draw clouds with proper transparency
      const cloudData = cloudCtx.createImageData(size, size)
      const atmosphereRgb = hexToRgb(color)

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - center.x
          const dy = y - center.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          // Only draw clouds within planet bounds
          if (dist > radius * 1.1) continue

          // Generate cloud pattern with time-based animation
          const n = noise.simplex3(x * cloudScale, y * cloudScale, timeOffset)

          // Only create clouds where noise exceeds threshold
          if (n > cloudThreshold) {
            const index = (y * size + x) * 4
            // Solid color with alpha handled by globalAlpha
            cloudData.data[index] = atmosphereRgb.r
            cloudData.data[index + 1] = atmosphereRgb.g
            cloudData.data[index + 2] = atmosphereRgb.b
            cloudData.data[index + 3] = 255
          }
        }
      }

      cloudCtx.putImageData(cloudData, 0, 0)

      // Draw clouds with consistent 50% opacity
      ctx.globalAlpha = 0.8
      ctx.drawImage(cloudCanvas, 0, 0)
      ctx.globalAlpha = 1.0

      // Continue animation
      animationRef.current = requestAnimationFrame(() => {
        setAnimationFrame((prev) => prev + 1)
      })
    }

    renderFrame(animationFrame)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [
    seed,
    color,
    terrain,
    land_color,
    liquid_percent,
    liquid_color,
    animationFrame,
  ])

  function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  return (
    <canvas ref={canvasRef} width={96} height={96} className="rounded-full" />
  )
}
