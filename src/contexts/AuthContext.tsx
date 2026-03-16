"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

// Constants
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://training-backend-wine.vercel.app/api'
    : 'https://training-backend-wine.vercel.app/api'

const STORAGE_KEYS = {
    USER: 'user',
    TOKEN: 'token'
} as const

interface User {
    id: string
    name: string
    email: string
    avatar: string
    joinDate: string
    totalHours: number
    completedCourses: number
    inProgressCourses: number
    certificates: number
    skillPoints: number
    level: string
    role: string
}

interface AuthResponse {
    success: boolean
    message?: string
    user?: User
}

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isInitialized: boolean
    login: (email: string, password: string) => Promise<AuthResponse>
    register: (name: string, email: string, password: string, role: string) => Promise<AuthResponse>
    logout: () => void
    updateUser: (userData: Partial<User>) => void
    isLoading: boolean
    getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper functions
const safeJsonParse = <T,>(value: string | null): T | null => {
    if (!value) return null
    try {
        return JSON.parse(value) as T
    } catch {
        return null
    }
}

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const createDefaultUser = (email: string, name: string): User => ({
    id: '',
    name,
    email,
    avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
    joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
    totalHours: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificates: 0,
    skillPoints: 0,
    level: "Beginner",
    role: "student"
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Safe storage functions
    const getStoredUser = useCallback((): User | null => {
        return safeJsonParse<User>(localStorage.getItem(STORAGE_KEYS.USER))
    }, [])

    const getStoredToken = useCallback((): string | null => {
        return localStorage.getItem(STORAGE_KEYS.TOKEN)
    }, [])

    const setStoredUser = useCallback((userData: User | null) => {
        if (userData) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
        } else {
            localStorage.removeItem(STORAGE_KEYS.USER)
        }
    }, [])

    const setStoredToken = useCallback((token: string | null) => {
        if (token) {
            localStorage.setItem(STORAGE_KEYS.TOKEN, token)
        } else {
            localStorage.removeItem(STORAGE_KEYS.TOKEN)
        }
    }, [])

    // Load user from localStorage on mount
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedUser = getStoredUser()
                const storedToken = getStoredToken()

                if (storedUser && storedToken) {
                    setUser(storedUser)
                    setIsAuthenticated(true)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                // Clear corrupted data
                setStoredUser(null)
                setStoredToken(null)
            } finally {
                setIsInitialized(true)
            }
        }

        initializeAuth()
    }, [getStoredUser, getStoredToken, setStoredUser, setStoredToken])

    const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
        // Input validation
        if (!email || !password) {
            return { success: false, message: "Email and password are required" }
        }

        if (!validateEmail(email)) {
            return { success: false, message: "Please enter a valid email address" }
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            // Handle non-JSON responses
            if (!response.headers.get('content-type')?.includes('application/json')) {
                return { success: false, message: "Invalid server response" }
            }

            const data = await response.json()

            if (response.ok) {
                const userResponse = data.user || data

                // Validate required fields
                const userId = userResponse.id || userResponse._id
                if (!userId) {
                    return { success: false, message: "Invalid user data received" }
                }

                // Extract user information
                const nameFields = ['name', 'fullName', 'displayName', 'username', 'firstName']

                const extractedName =
                    nameFields.map(field => userResponse[field]).find(Boolean)
                    || email.split("@")[0]



                const extractedRole = userResponse.role || data.role || "student"

                // Create user object
                const userData: User = {
                    id: userId,
                    name: extractedName,
                    email: email,
                    avatar: userResponse.avatar || data.avatar || createDefaultUser(email, extractedName).avatar,
                    joinDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" }),
                    totalHours: userResponse.totalHours || data.totalHours || 0,
                    completedCourses: userResponse.completedCourses || data.completedCourses || 0,
                    inProgressCourses: userResponse.inProgressCourses || data.inProgressCourses || 0,
                    certificates: userResponse.certificates || data.certificates || 0,
                    skillPoints: userResponse.skillPoints || data.skillPoints || 0,
                    level: userResponse.level || data.level || "Beginner",
                    role: extractedRole
                }

                // Store token and user data
                if (data.token) {
                    setStoredToken(data.token)
                }

                setUser(userData)
                setIsAuthenticated(true)
                setStoredUser(userData)

                return { success: true, user: userData }
            } else {
                return {
                    success: false,
                    message: data.message || `Login failed: ${response.status}`
                }
            }
        } catch (error) {
            console.error('Login error:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : "Network error. Please try again."
            }
        } finally {
            setIsLoading(false)
        }
    }, [setStoredToken, setStoredUser])

    const register = useCallback(async (
        name: string,
        email: string,
        password: string,
        role: string
    ): Promise<AuthResponse> => {
        // Input validation
        if (!name?.trim() || !email || !password) {
            return { success: false, message: "All fields are required" }
        }

        if (!validateEmail(email)) {
            return { success: false, message: "Please enter a valid email address" }
        }

        if (password.length < 6) {
            return { success: false, message: "Password must be at least 6 characters" }
        }

        setIsLoading(true)

        try {
            const requestBody = {
                name: name.trim(),
                email: email.trim(),
                password: password,
                role: role || "student"
            }

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            })

            if (!response.headers.get('content-type')?.includes('application/json')) {
                return { success: false, message: "Invalid server response" }
            }

            const data = await response.json()

            if (response.ok) {
                // Auto-login after successful registration
                const loginResult = await login(email, password)
                return loginResult
            } else {
                return {
                    success: false,
                    message: data.message || `Registration failed: ${response.status}`
                }
            }
        } catch (error) {
            console.error('Registration error:', error)
            return {
                success: false,
                message: error instanceof Error ? error.message : "Network error. Please try again."
            }
        } finally {
            setIsLoading(false)
        }
    }, [login])

    const logout = useCallback(() => {
        setUser(null)
        setIsAuthenticated(false)
        setStoredUser(null)
        setStoredToken(null)
    }, [setStoredUser, setStoredToken])

    const updateUser = useCallback((userData: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...userData }
            setUser(updatedUser)
            setStoredUser(updatedUser)
        }
    }, [user, setStoredUser])

    const getToken = useCallback((): string | null => {
        return getStoredToken()
    }, [getStoredToken])

    // Cleanup on unmount (optional)
    useEffect(() => {
        return () => {
            // Cleanup if needed
        }
    }, [])



    const contextValue: AuthContextType = {
        user,
        isAuthenticated,
        isInitialized,
        login,
        register,
        logout,
        updateUser,
        isLoading,
        getToken
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

