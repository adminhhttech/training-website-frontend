"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const { toast } = useToast();
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [offers, setOffers] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast({
        title: "Full name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    if (!role) {
      toast({
        title: "Role required",
        description: "Please select your role.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Submitting registration with:", { 
        name: trimmedName, 
        email: trimmedEmail, 
        password, 
        role 
      });
      
      const result = await register(trimmedName, trimmedEmail, password, role);
      
      if (result.success && result.user) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully! Redirecting to dashboard...",
          variant: "default",
        });

        // Redirect based on user role
        setTimeout(() => {
          if (result.user?.role === "instructor") {
            navigate("/instructor/dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        toast({
          title: "Registration failed",
          description: result.message || "An error occurred during registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 pt-12 md:pt-16 lg:pt-20 pb-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[600px]">
            {/* Illustration */}
            <div
              className={`flex justify-center lg:justify-start transition-all duration-1000 ease-out ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <img
                src="/mobile-sign.webp"
                alt="Learning icons illustration"
                className="mx-auto mb-6 block h-40 w-auto object-contain lg:hidden transition-transform duration-300 hover:scale-105"
              />
              <img
                src="/signup.jpg"
                alt="Learners illustration"
                className="hidden lg:block w-full max-w-xl h-auto object-contain transition-transform duration-300 hover:scale-105 -mt-40"
                style={{ maxHeight: "1000px" }}
              />
            </div>

            {/* Form */}
            <div
              className={`w-full max-w-md mx-auto lg:mx-0 lg:max-w-lg transition-all duration-1000 ease-out delay-300 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 lg:p-10 transition-all duration-300 hover:shadow-2xl">
                {/* Heading */}
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                    Join Our Community
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Start your learning journey today
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-[#0080ff] rounded-full"></div>
                      <span>Access to 1000+ courses</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-[#0080ff] rounded-full"></div>
                      <span>Learn from industry experts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-[#0080ff] rounded-full"></div>
                      <span>Get certified upon completion</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-6">
                  {/* First row: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-800 font-medium text-sm">
                        Full name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                        className="h-12 text-base border-gray-300 focus:border-[#0080ff] focus:ring-[#0080ff] transition-all duration-200 hover:border-gray-400"
                      />
                    </div>

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
                        className="h-12 text-base border-gray-300 focus:border-[#0080ff] focus:ring-[#0080ff] transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Second row: Role and Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-800 font-medium text-sm">
                        I am a/an
                      </Label>
                      <select
                        id="role"
                        className="h-12 w-full text-base border border-gray-300 rounded-md px-3 focus:border-[#0080ff] focus:ring-[#0080ff] transition-all duration-200 hover:border-gray-400"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-800 font-medium text-sm">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-base border-gray-300 focus:border-[#0080ff] focus:ring-[#0080ff] transition-all duration-200 hover:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Password hint */}
                  <p className="text-xs text-gray-500 -mt-4">
                    Must be at least 6 characters long
                  </p>

                  {/* Checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="offers"
                      checked={offers}
                      onCheckedChange={(v) => setOffers(Boolean(v))}
                      className="border-gray-300 data-[state=checked]:bg-[#0080ff] data-[state=checked]:text-white mt-0.5 transition-all duration-200"
                    />
                    <label
                      htmlFor="offers"
                      className="text-sm text-gray-700 leading-6 cursor-pointer select-none"
                    >
                      Send me special offers, personalized recommendations, and learning tips.
                    </label>
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
                        Creating account...
                      </div>
                    ) : (
                      <>
                        <Mail className="mr-2 h-5 w-5" />
                        Create Account
                      </>
                    )}
                  </Button>

                  {/* Terms and conditions */}
                  <p className="text-xs text-gray-500 text-center leading-relaxed pt-2">
                    By signing up, you agree to our{" "}
                    <a
                      className="text-[#0080ff] hover:underline transition-colors duration-200"
                      href="#"
                    >
                      Terms of Use
                    </a>{" "}
                    and{" "}
                    <a
                      className="text-[#0080ff] hover:underline transition-colors duration-200"
                      href="#"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>

                  {/* Login box */}
                  <div className="mt-4 border border-gray-200 bg-gray-50 px-6 py-4 rounded-xl text-center text-sm transition-all duration-200 hover:bg-gray-100">
                    <span className="text-gray-600">
                      Already have an account?
                    </span>{" "}
                    <Link
                      to="/signin"
                      className="font-semibold text-[#0080ff] hover:underline transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}