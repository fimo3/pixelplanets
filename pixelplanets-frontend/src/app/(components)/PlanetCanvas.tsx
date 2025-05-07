"use client"
import { useEffect, useRef } from "react"
import Noise from "noisejs"

type Props = {
  seed: string
  color: string
  terrain: string
}

export default function PlanetCanvas({ seed, color, terrain }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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
    const imageData = ctx.createImageData(size, size)

    const terrainConfig: Record<string, { scale: number; contrast: number }> = {
      rocky: { scale: 0.05, contrast: 1.3 }, // Adjusted scale for noisejs
      icy: { scale: 0.03, contrast: 0.7 },
      jungle: { scale: 0.06, contrast: 1.0 },
      desert: { scale: 0.04, contrast: 1.2 },
      gaseous: { scale: 0.02, contrast: 0.5 },
    }

    const config = terrainConfig[terrain.toLowerCase()] || {
      scale: 0.04,
      contrast: 1.0,
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - radius
        const dy = y - radius
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist > radius) continue

        // Get noise value (noisejs returns -1 to 1)
        const n = noise.simplex2(x * config.scale, y * config.scale)
        let brightness = (n + 1) / 2 // Convert to 0-1 range
        brightness = Math.pow(brightness, config.contrast)
        const value = Math.floor(brightness * 255)

        const index = (y * size + x) * 4
        imageData.data[index] = value
        imageData.data[index + 1] = value
        imageData.data[index + 2] = value
        imageData.data[index + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)

    // Apply color overlay
    ctx.fillStyle = color + "88" // Add some transparency
    ctx.beginPath()
    ctx.arc(radius, radius, radius, 0, Math.PI * 2)
    ctx.fill()
  }, [seed, color, terrain])

  return (
    <canvas ref={canvasRef} width={96} height={96} className="rounded-full" />
  )
}
