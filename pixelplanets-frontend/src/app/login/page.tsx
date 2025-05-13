"use client"

import { useState, ChangeEvent, FormEvent } from "react"

type LoginData = {
  email: string
  password: string
}

type LoginProps = {
  onsubmit?: (data: LoginData) => void
}

const Login: React.FC<LoginProps> = ({ onsubmit }) => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  })

  const [error, setError] = useState<string | null>(null) // To store any login errors

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await fetch("http://127.0.0.1:8000/api/members/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Invalid email or password")
      }

      const data = await response.json()

      // Assuming the backend returns a token upon successful login
      const token = data.token

      if (token) {
        localStorage.setItem("authToken", token) // Store the token in localStorage
        console.log("Login successful", data)

        // You can redirect or update the UI after successful login
        if (onsubmit) {
          onsubmit(formData)
        }
      }
    } catch (err) {
      setError("Failed to log in. Please check your credentials.")
      console.error("Login error:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label className="block font-medium">Email</label>
        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={formData.email}
          className="border w-full p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Password</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={formData.password}
          className="border w-full p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Log in
      </button>
    </form>
  )
}

export default Login
