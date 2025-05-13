"use client"

import { useState, ChangeEvent, FormEvent } from "react"

type SignupData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type SignupProps = {
  onsubmit?: (data: SignupData) => void
}

const Signup: React.FC<SignupProps> = ({ onsubmit }) => {
  const [formData, setFormData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState<string | null>(null) // To store any signup errors
  const [loading, setLoading] = useState<boolean>(false) // To show loading state during form submission

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/members/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to create an account. Please try again.")
      }

      const data = await response.json()

      console.log("Signup successful:", data)

      // Handle successful signup
      if (onsubmit) {
        onsubmit(formData)
      }

      // You can redirect or update the UI after signup (optional)
    } catch (err) {
      setError("Signup failed. Please check the form and try again.")
      console.error("Signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>

      {error && (
        <div className="text-red-500 text-sm mb-4">
          <p>{error}</p>
        </div>
      )}

      <div>
        <label className="block font-medium">Name</label>
        <input
          name="name"
          type="text"
          onChange={handleChange}
          value={formData.name}
          className="border w-full p-2 rounded"
          required
        />
      </div>

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

      <div>
        <label className="block font-medium">Confirm Password</label>
        <input
          name="confirmPassword"
          type="password"
          onChange={handleChange}
          value={formData.confirmPassword}
          className="border w-full p-2 rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  )
}

export default Signup
