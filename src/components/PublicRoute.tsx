// PublicRoute.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) return null // or loader

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
