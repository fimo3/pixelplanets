import axios from "axios"

const API_BASE = "http://localhost:8000/api"

export const fetchPlanets = async () => {
  const response = await axios.get(`${API_BASE}/planets/`)
  return response.data
}

export const createPlanet = async (planetData) => {
  const response = await axios.post(`${API_BASE}/planets/`, planetData)
  return response.data
}
