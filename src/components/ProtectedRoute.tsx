"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export const ProtectedRoute = ({
    children,
    requiredRole
}: {
    children: React.ReactNode
    requiredRole?: string
}) => {
    const { user, isInitialized } = useAuth()

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0080ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && user.role !== requiredRole) {
        if (user.role === "instructor") {
            return <Navigate to="/instructor/dashboard" replace />
        } else {
            return <Navigate to="/dashboard" replace />
        }
    }

    return <>{children}</>
}