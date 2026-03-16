"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function SignInPage() {
  const { toast } = useToast()
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (!password) {
      toast({
        title: "Password required",
        description: "Please enter your password.",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await login(email, password)
      
      if (result.success && result.user) {
        toast({
          title: "Sign in successful",
          description: "Welcome back! Redirecting to dashboard...", 
        })
        
        // Redirect based on user role
        setTimeout(() => {
          if (result.user?.role === "instructor") {
            navigate("/instructor/dashboard")
          } else {
            navigate("/dashboard")
          }
        }, 1500)
      } else {
        toast({
          title: "Sign in failed",
          description: result.message || "Invalid email or password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[600px]">
            
            {/* Illustration Section */}
            <div
              className={`flex justify-center lg:justify-start transition-all duration-1000 ease-out ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
              }`}
            >
              {/* Mobile illustration */}
              <img
                src="/mobile-sign.webp"
                alt="Learning icons illustration"
                className="mx-auto mb-8 block h-36 sm:h-40 md:h-48 w-auto object-contain lg:hidden transition-transform duration-300 hover:scale-105"
              />
              {/* Desktop illustration */}
              <img
                src="/signin.jpg"
                alt="Learners illustration"
                className="hidden lg:block w-full max-w-xl h-auto object-contain transition-transform duration-300 hover:scale-105"
                style={{ maxHeight: "480px" }}
              />
            </div>

            {/* Form Section */}
            <div
              className={`w-full max-w-md mx-auto lg:mx-0 lg:max-w-lg transition-all duration-1000 ease-out delay-300 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
            >
              {/* Form Container */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl">
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                    Welcome Back!
                  </h1>
                  <p className="text-gray-600 text-base md:text-lg">
                    Sign in to continue your learning journey
                  </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-800 font-medium text-sm">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      aria-label="Email"
                      className="h-12 text-base border-gray-300 focus:border-[#0080ff] focus:ring-[#0080ff] transition-all duration-200 hover:border-gray-400"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-800 font-medium text-sm">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        aria-label="Password"
                        className="h-12 text-base border-gray-300 focus:border-[#0080ff] focus:ring-[#0080ff] transition-all duration-200 hover:border-gray-400 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#0080ff] hover:bg-[#0080ff]/90 text-white font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                {/* Sign up link */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-6 py-4 text-center text-sm transition-all duration-200 hover:bg-gray-100">
                    <span className="text-gray-600">Don't have an account?</span>{" "}
                    <Link
                      to="/signup"
                      className="font-semibold text-[#0080ff] hover:underline transition-colors duration-200"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}