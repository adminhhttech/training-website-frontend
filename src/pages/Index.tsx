// Filename: Index.tsx
import React, { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import CourseSection from "../components/CourseSection"
import FeaturesSection from "../components/features"
import HowItWorksSection from "../components/how-it-works"
import TestimonialsSection from "../components/testimonials"
import Footer from "../components/Footer"
import { Play, Apple } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Index: React.FC = () => {
  const { user, isInitialized } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = React.useState("")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [hasRedirected, setHasRedirected] = useState(false)

  // Redirect to dashboard only on FIRST VISIT when user is authenticated
  useEffect(() => {
    // Only check after auth is initialized
    if (isInitialized && user && !hasRedirected) {
      setHasRedirected(true)
      // Small delay for better UX
      const timer = setTimeout(() => {
        navigate("/dashboard")
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [user, isInitialized, navigate, hasRedirected])

  const goToSignup = () => {
    navigate("/signup")
  }

  // Practice Lab navigation handlers
  const handleStartExplore = () => {
    navigate("/courses")
  }

  const handleStartSoftSkills = () => {
    navigate("/softskills")
  }

  const handleStartTechnical = () => {
    navigate("/technical")
  }

  const goToDashboard = () => {
    navigate("/dashboard")
  }

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0080ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated and it's their first visit, show redirecting message
  if (user && !hasRedirected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0080ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Taking you to your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show the landing page (for both logged in and non-logged in users)
  return (
    <div className="min-h-screen relative bg-gray-50 overflow-hidden">
      {/* Background canvas animation - UNCOMMENTED */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      />

      <Navbar search={search} setSearch={setSearch} />

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            {/* Headline */}
            <h1
              className="font-bold tracking-tight text-gray-900 leading-[1.1] mb-4
                        text-[clamp(1.9rem,6vw,3.25rem)] sm:text-[clamp(2.25rem,5vw,3.75rem)] [text-wrap:balance]"
            >
              Up Your{" "}
              <span className="bg-gradient-to-r from-[#0080ff] to-[#6aa9ff] bg-clip-text text-transparent">
                Skills
              </span>
              <span className="block sm:inline"> to </span>
              <span className="bg-gradient-to-r from-[#0080ff] to-[#6aa9ff] bg-clip-text text-transparent">
                Advance
              </span>
              <span className="block sm:inline"> Your </span>
              <span className="bg-gradient-to-r from-[#0080ff] to-[#6aa9ff] bg-clip-text text-transparent">
                Career Path
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-[0.98rem] sm:text-lg text-gray-600 leading-relaxed max-w-prose mx-auto md:mx-0 mb-6">
              Learn in-demand skills across design, development, and career growth with
              practical projects, expert mentors, and bite-sized lessons tailored for you.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              {user ? (
                <>
                  {/* Dashboard button for logged in users */}
                  <button
                    onClick={goToDashboard}
                    className="bg-[#0080ff] hover:bg-[#0080ff]/80 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Go to Dashboard
                  </button>
                  {/* Practice Lab Buttons for logged in users */}
                  <button
                    onClick={handleStartExplore}
                    className="text-[#0080ff] hover:text-[#0080ff]/80 border border-[#0080ff] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    Explore Courses
                  </button>
                </>
              ) : (
                <>
                  {/* Original Buttons for Non-Logged In Users */}
                  <button
                    onClick={goToSignup}
                    className="bg-[#0080ff] hover:bg-[#0080ff]/80 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={goToSignup}
                    className="text-[#0080ff] hover:text-[#0080ff]/80 border border-[#0080ff] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                  >
                    Get free trial
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex justify-center md:justify-end items-center mt-4 md:mt-0"
          >
            <div className="h-full flex items-center justify-center bg-gray-50 p-8">
              <img
                src="/hero-1.png"
                alt="Students"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Sections */}
      <div className="relative z-10">
        <FeaturesSection />
        <CourseSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </div>

      {/* CTA Strip */}
      <section className="bg-[#0080ff] py-16 sm:py-20 text-white relative z-10">
        <div className="container mx-auto text-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8">
              Join thousands of successful students who have already started their journey.
              Download our mobile app for seamless learning on the go.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 sm:mb-8">
              <button
                onClick={goToSignup}
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 sm:px-8 py-3 sm:py-4 text-[#0080ff] font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                <Apple className="w-5 h-5 sm:w-6 sm:h-6" /> App Store
              </button>
              <button
                onClick={goToSignup}
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 sm:px-8 py-3 sm:py-4 text-[#0080ff] font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6" /> Google Play
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-100">
              Available on iOS and Android • Free Download
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Index