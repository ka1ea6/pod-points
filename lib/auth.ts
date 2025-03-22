// This is a mock implementation - in a real app, you would use NextAuth.js or similar
export function getCurrentUser() {
  // Mock user data - synchronous version
  return {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    image: "/placeholder.svg?height=32&width=32",
    role: "admin", // or "user"
  }
}

