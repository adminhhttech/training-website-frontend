"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Star } from "lucide-react"
import { coursesByCategory } from "../pages/coursesbycategory"
import { useAuth } from "../contexts/AuthContext"

const CourseSection = () => {
  const categories = Object.keys(coursesByCategory)
  const [activeCategory, setActiveCategory] = useState("All Courses")

  // Each category has its own currentIndex
  const [carouselIndexes, setCarouselIndexes] = useState<Record<string, number>>(
    Object.fromEntries(categories.map((c) => [c, 0]))
  )

  const [isHovered, setIsHovered] = useState(false)

  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const courses = coursesByCategory[activeCategory as keyof typeof coursesByCategory] || []
  const currentIndex = carouselIndexes[activeCategory]

  const handleCourseClick = (courseId: number) => {
    if (isAuthenticated) {
      navigate(`/course/${courseId}`)
    } else {
      localStorage.setItem('redirectAfterLogin', `/course/${courseId}`)
      navigate("/login")
    }
  }

  const handleDotClick = (index: number) => {
    setCarouselIndexes((prev) => ({
      ...prev,
      [activeCategory]: index,
    }))
  }

  // Responsive: number of courses per view
  const getCoursesPerView = () => {
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  const [perView, setPerView] = useState(getCoursesPerView())

  // Update perView on resize
  useEffect(() => {
    const handleResize = () => setPerView(getCoursesPerView())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-slide with hover pause
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && courses.length > 0) {
        setCarouselIndexes((prev) => ({
          ...prev,
          [activeCategory]: (prev[activeCategory] + 1) % Math.ceil(courses.length / perView)
        }))
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [isHovered, activeCategory, perView, courses.length])

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Most Popular Class</h2>
          <p className="text-lg text-gray-600">
            Let's join our famous class, the knowledge provided will definitely be useful for you.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#0080FF] text-white shadow-sm"
                  : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {courses.length > 0 ? (
          <>
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4 }}
                  className={`grid gap-6 pb-4 ${
                    perView === 1
                      ? "grid-cols-1"
                      : perView === 2
                      ? "sm:grid-cols-2"
                      : "sm:grid-cols-2 lg:grid-cols-3"
                  }`}
                >
                  {courses
                    .slice(currentIndex * perView, currentIndex * perView + perView)
                    .map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer md:"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        <div className="relative h-48">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                          {course.duration && (
                            <span className="absolute top-2 right-2 bg-white text-gray-700 text-xs px-2 py-1 rounded-md shadow">
                              ⏱ {course.duration}
                            </span>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                          <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 group-hover:text-[#0080FF] transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600">{course.instructor}</p>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(course.rating) ? "fill-current" : "stroke-current"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-gray-700">{course.rating}</span>
                            <span className="text-gray-500">({course.reviews.toLocaleString()})</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                ₹{course.price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <button
                              className="bg-[#0080FF] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#0080FF]/90 transition"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCourseClick(course.id)
                              }}
                            >
                              View Course
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(courses.length / perView) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition ${
                    index === currentIndex ? "bg-[#0080FF]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">No courses available in this category.</p>
        )}

        <div className="text-center mt-12">
          <a href="/courses">
            <button className="bg-white border-2 border-[#0080FF] hover:border-[#0080FF]/80 hover:text-[#0080FF]/80 text-[#0080FF] px-8 py-3 rounded-full font-medium transition-colors">
              Explore All Programs
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}

export default CourseSection
