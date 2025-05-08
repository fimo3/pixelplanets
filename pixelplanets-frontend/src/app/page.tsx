"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { fetchPlanets, createPlanet } from "../../lib/api"
import Form from "./(components)/Form"
import PlanetCanvas from "./(components)/PlanetCanvas"
import logo from "../../public/Pixnet_logo.png"

type Planet = {
  id: string
  name: string
  seed: string
  terrain: string
  atmosphere_color: string
  land_color: string
  liquid_percent: number
  liquid_color: string
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
      <div className="flex items-center justify-between">
        <Image src={logo} alt="Pixnet logo" width={100} />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Create Custom Planet
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-4">Create a New Planet</h2>
            <Form onsubmit={handleSubmit} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {planets.map((planet) => (
          <div
            key={planet.id || planet.seed}
            className="p-4 bg-gray-100 rounded shadow text-center"
          >
            <PlanetCanvas
              seed={planet.seed}
              color={planet.atmosphere_color}
              land_color={planet.land_color}
              terrain={planet.terrain}
              liquid_percent={planet.liquid_percent}
              liquid_color={planet.liquid_color}
            />
            <h2 className="font-semibold mt-2">{planet.name}</h2>
            <p>Terrain: {planet.terrain}</p>
            <p>
              Terrain color:{" "}
              <span style={{ color: planet.land_color }}>
                {planet.land_color}
              </span>
            </p>
            <p>
              Atmosphere:{" "}
              <span style={{ color: planet.atmosphere_color }}>
                {planet.atmosphere_color}
              </span>
            </p>
            <p>Liquid: {planet.liquid_percent}%</p>
            <p>
              Liquid color:{" "}
              <span style={{ color: planet.liquid_color }}>
                {planet.liquid_color}
              </span>
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
