export interface User {
  userId: string
  role: "regulator" | "farmer" | "manufacturer" | "laboratory" | "consumer"
  name?: string
  organization?: string
  location?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (userId: string) => Promise<void>
  logout: () => void
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function loginUser(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  const data = await response.json()

  // Determine role based on userId pattern
  let role: User["role"] = "consumer"
  if (userId.startsWith("Regulator")) role = "regulator"
  else if (userId.startsWith("Farmer")) role = "farmer"
  else if (userId.startsWith("Manufacturer")) role = "manufacturer"
  else if (userId.includes("Lab")) role = "laboratory"

  return {
    userId,
    role,
    name: data.name,
    organization: data.organization,
    location: data.location,
  }
}
