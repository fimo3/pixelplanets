const response = await fetch("http://localhost:8000/api/members/signup/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(formData),
})

const data = await response.json()
if (response.ok) {
  console.log("Signup successful:", data)
} else {
  console.log("Signup failed:", data)
}
