"use client"

import ResumeBuilderModule from "@/modules/resume-builder"
import { useEffect } from "react"
import { useLocation, BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider, useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"


import MentorModule from "@/modules/MentorModule"
import AICounsellorModule from "@/modules/AICounsellorModule"

import Index from "./pages/Index"
import SignInPage from "./pages/signin"
import SignUpPage from "./pages/signup"
import CoursesPage from "./pages/allcourses"
import Dashboard from "./pages/dashboard"
import CoursePage from "./pages/coursePage"
import PersonalAssistant from "./pages/personalAssistant"
import AptitudePage from "./pages/aptitude"
import SoftSkillsLab from "./pages/softskills"
import TechnicalLab from "./pages/technical"
import InstructorDashboard from "./pages/InstructorDashboard"
import VideoRadar from './modules/video-radar/VideoRadar';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
})

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" })
    }, [pathname])

    return null
}

const NavigateToDashboard = () => {
    const { user, isInitialized } = useAuth()

    if (!isInitialized) return null

    if (user?.role === "instructor") {
        return <Navigate to="/instructor/dashboard" replace />
    }

    if (user) {
        return <Navigate to="/dashboard" replace />
    }

    return <Navigate to="/home" replace />
}

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <ScrollToTop />

                        <Routes>
                            {/* ROOT */}
                            <Route path="/" element={<NavigateToDashboard />} />

                            {/* PUBLIC */}
                            <Route path="/home" element={<Index />} />
                            <Route path="/signin" element={<SignInPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/login" element={<SignInPage />} />
                            <Route path="/courses" element={<CoursesPage />} />
                            <Route path="/course/:courseId" element={<CoursePage />} />
                            <Route path="/video-radar" element={<VideoRadar />} />

                            {/* STUDENT */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* PERSONAL ASSISTANT */}
                            <Route
                                path="/personal-assistant"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <PersonalAssistant />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/resume-builder/*"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <ResumeBuilderModule />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/mentor/*"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <MentorModule />
                                    </ProtectedRoute>
                                }
                            />


                            <Route path="/counsellor/*" element={<AICounsellorModule />} />

                            <Route path="/coursepage" element={
                                <ProtectedRoute requiredRole="student">
                                    <Navigate to="/course/695ea355ac537267370e1755" replace />
                                </ProtectedRoute>
                            } />

                            <Route
                                path="/aptitude"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <AptitudePage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/softskills"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <SoftSkillsLab />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/technical"
                                element={
                                    <ProtectedRoute requiredRole="student">
                                        <TechnicalLab />
                                    </ProtectedRoute>
                                }
                            />

                            {/* INSTRUCTOR */}
                            <Route
                                path="/instructor/dashboard"
                                element={
                                    <ProtectedRoute requiredRole="instructor">
                                        <InstructorDashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>

                        <Toaster />
                        <Sonner />
                    </BrowserRouter>
                </AuthProvider>
            </TooltipProvider>
        </QueryClientProvider>
    )
}

export default App