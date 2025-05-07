"use client"
import { useEffect, useRef, useState } from "react"
import Noise from "noisejs"

type Props = {
  seed: string
  color: string
  terrain: string
  liquid_percent?: number
  liquid_color?: string
}

export default function PlanetCanvas({
  seed,
  color,
  terrain,
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
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - center.x
          const dy = y - center.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > radius) continue

          const n = noise.simplex2(x * config.scale, y * config.scale)
          let brightness = (n + 1) / 2
          brightness = Math.pow(brightness, config.contrast * 1.5) // Enhanced contrast

          const isLiquid = n < liquid_percent / 100 - 0.5

          const index = (y * size + x) * 4
          if (isLiquid) {
            imageData.data[index] = parseInt(liquid_color.slice(1, 3), 16)
            imageData.data[index + 1] = parseInt(liquid_color.slice(3, 5), 16)
            imageData.data[index + 2] = parseInt(liquid_color.slice(5, 7), 16)
            imageData.data[index + 3] = 255
          } else {
            const value = Math.floor(brightness * 255)
            imageData.data[index] = value
            imageData.data[index + 1] = value
            imageData.data[index + 2] = value
            imageData.data[index + 3] = 255
          }
        }
      }
      terrainCache.current = imageData
    }

    const renderFrame = (frame: number) => {
      if (!ctx || !terrainCache.current) return

      // 1. Clear and draw terrain
      ctx.clearRect(0, 0, size, size)
      ctx.putImageData(terrainCache.current, 0, 0)

      // 2. Draw VERY subtle clouds with transparency
      const cloudScale = 0.04
      const timeOffset = frame * 0.005 // Slow movement

      // Create temporary canvas for clouds
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = size
      tempCanvas.height = size
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) return

      const cloudData = tempCtx.createImageData(size, size)

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - center.x
          const dy = y - center.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > radius * 1.05) continue // Only slightly beyond planet edge

          const n = noise.simplex3(x * cloudScale, y * cloudScale, timeOffset)

          // Only draw clouds where noise > threshold (0.3)
          if (n > 0.3) {
            const index = (y * size + x) * 4
            const opacity = Math.min((n - 0.3) * 0.8, 0.3) * 255 // Max 30% opacity

            cloudData.data[index] = parseInt(color.slice(1, 3), 16)
            cloudData.data[index + 1] = parseInt(color.slice(3, 5), 16)
            cloudData.data[index + 2] = parseInt(color.slice(5, 7), 16)
            cloudData.data[index + 3] = opacity
          }
        }
      }
      tempCtx.putImageData(cloudData, 0, 0)

      // Draw clouds with additional transparency
      ctx.globalAlpha = 0.5
      ctx.drawImage(tempCanvas, 0, 0)
      ctx.globalAlpha = 1.0

      // 3. Minimal color overlay
      ctx.fillStyle = color + "10" // 6% opacity
      ctx.beginPath()
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2)
      ctx.fill()

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
  }, [seed, color, terrain, liquid_percent, liquid_color, animationFrame])

  return (
    <canvas ref={canvasRef} width={96} height={96} className="rounded-full" />
  )
}
