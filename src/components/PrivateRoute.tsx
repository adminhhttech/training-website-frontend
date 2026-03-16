// PrivateRoute.tsx
import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) return null // loader

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
