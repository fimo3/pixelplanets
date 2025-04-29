"use client"

import { useState, ChangeEvent, FormEvent } from "react"

type FormData = {
  name: string
  seed: string
  terrain: string
  atmosphere_color: string
}

type FormProps = {
  onSubmit: (data: FormData) => void
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    seed: "",
    terrain: "rocky",
    atmosphere_color: "#77aadd",
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <input
          name="name"
          type="text"
          onChange={handleChange}
          value={formData.name}
          className="border w-full p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Seed</label>
        <input
          name="seed"
          type="text"
          onChange={handleChange}
          value={formData.seed}
          className="border w-full p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Terrain</label>
        <select
          name="terrain"
          onChange={handleChange}
          value={formData.terrain}
          className="border w-full p-2 rounded"
        >
          <option value="rocky">Rocky</option>
          <option value="icy">Icy</option>
          <option value="gaseous">Gaseous</option>
          <option value="dessert">Desert</option>
          <option value="jungle">Jungle</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Atmosphere color</label>
        <input
          name="atmosphere_color"
          type="color"
          onChange={handleChange}
          value={formData.atmosphere_color}
          className="w-full h-10"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        Submit
      </button>
    </form>
  )
}

export default Form
