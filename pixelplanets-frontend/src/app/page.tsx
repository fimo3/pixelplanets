"use client"

import { useEffect, useState } from "react"
import { fetchPlanets, createPlanet } from "../../lib/api"
import Form from "./(components)/Form"

type Planet = {
  name: string
  seed: string
  terrain: string
  atmosphere_color: string
}

export default function Home() {
  const [planets, setPlanets] = useState<Planet[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchPlanets().then(setPlanets)
  }, [])

  const handleSubmit = async (formData: Planet) => {
    const created = await createPlanet(formData)
    setPlanets((prev) => [created, ...prev])
    setIsModalOpen(false)
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🪐 PixelPlanets</h1>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Create Custom Planet
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-4">Create a New Planet</h2>
            <Form onSubmit={handleSubmit} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {planets.map((planet) => (
          <div key={planet.seed} className="p-4 bg-gray-100 rounded shadow">
            <h2 className="font-semibold">{planet.name}</h2>
            <p>Terrain: {planet.terrain}</p>
            <p>
              Color:{" "}
              <span style={{ color: planet.atmosphere_color }}>
                {planet.atmosphere_color}
              </span>
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
