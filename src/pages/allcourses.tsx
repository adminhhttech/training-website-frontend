"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { coursesByCategory } from "./coursesbycategory"
import { useAuth } from "../contexts/AuthContext"

const AllCoursesPage = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { isAuthenticated } = useAuth()

  const allCourses = Object.values(coursesByCategory).flat()
  const filteredCourses =
    selectedCategory === "All"
      ? allCourses
      : coursesByCategory[selectedCategory as keyof typeof coursesByCategory] || []

  const handleCourseClick = (courseId: number) => {
    if (isAuthenticated) {
      navigate(`/course/${courseId}`)
    } else {
      // Save the intended destination and redirect to login
      localStorage.setItem('redirectAfterLogin', `/course/${courseId}`)
      navigate("/login")
    }
  }

  return (
    <>
      <Navbar />

      <section className="py-20 bg-gradient-to-b from-white to-gray-100 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Explore Our Courses</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Master the latest skills in development, design, and more. Choose a category to get started.
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              className={`px-5 py-2 rounded-full font-semibold border transition-all ${
                selectedCategory === "All"
                  ? "bg-[#0080FF] text-white"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </button>
            {Object.keys(coursesByCategory).map((category) => (
              <button
                key={category}
                className={`px-5 py-2 rounded-full font-semibold border transition-all ${
                  selectedCategory === category
                    ? "bg-[#0080FF] text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col gap-2 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-[#0080FF]">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">{course.instructor}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(course.rating)
                              ? "fill-current"
                              : "stroke-current"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium text-gray-700">{course.rating}</span>
                    <span className="text-gray-500">({course.reviews.toLocaleString()})</span>
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{course.price.toLocaleString("en-IN")}
                      </span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{course.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {course.tag && (
                      <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                        {course.tag}
                      </span>
                    )}
                  </div>

                  <button
                    className="mt-4 w-full bg-[#0080FF] text-white py-2 rounded-lg font-semibold hover:bg-[#0080FF]/90 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCourseClick(course.id)
                    }}
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default AllCoursesPage