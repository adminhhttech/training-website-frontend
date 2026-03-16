"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const FeaturesSection = () => {
    const features = [
        {
            title: "Interactive Courses",
            description:
                "Hands-on lessons, quizzes, and projects that simulate real-world challenges.",
            icon: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
        },
        {
            title: "Expert Instructors",
            description:
                "Courses crafted and delivered by professionals with real-world expertise.",
            icon: "https://cdn-icons-png.flaticon.com/512/2784/2784460.png",
        },
        {
            title: "Track Your Progress",
            description:
                "Visual dashboards to monitor performance and stay motivated.",
            icon: "https://cdn-icons-png.flaticon.com/512/2910/2910791.png",
        },
        {
            title: "Learner Community",
            description:
                "Engage in forums, share knowledge, and solve problems together.",
            icon: "https://cdn-icons-png.flaticon.com/512/3601/3601212.png",
        },
        {
            title: "Certificates & Badges",
            description:
                "Receive verifiable certificates and badges as you complete goals.",
            icon: "https://cdn-icons-png.flaticon.com/512/3135/3135765.png",
        },
        {
            title: "Learn Anywhere",
            description:
                "Available 24/7 on all devices — learn from home, work, or while traveling.",
            icon: "https://cdn-icons-png.flaticon.com/512/4069/4069625.png",
        },
    ]

    const itemsPerSlide = 3
    const totalSlides = Math.ceil(features.length / itemsPerSlide)

    const [currentSlide, setCurrentSlide] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    // Auto-slide with hover pause
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                setCurrentSlide((prev) => (prev + 1) % totalSlides)
            }
        }, 4000)
        return () => clearInterval(interval)
    }, [isHovered, totalSlides])

    const handleDotClick = (index: number) => {
        setCurrentSlide(index)
    }

    const startIndex = currentSlide * itemsPerSlide
    const visibleFeatures = features.slice(
        startIndex,
        startIndex + itemsPerSlide
    )

    return (
        <section className="py-24 bg-white relative z-10">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Heading */}
                <div className="mb-16 text-center">
                    <p className="text-[#0080ff] font-semibold mb-2">Our Features</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        Fostering a playful & engaging learning <br /> environment
                    </h2>
                </div>

                {/* Cards */}
                <div
                    className="relative overflow-hidden pb-8"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {visibleFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl p-8 transition-all shadow-md hover:shadow-lg 
                                bg-white text-gray-800 border border-gray-200 
                                hover:border-[#0080ff] hover:border-2 group cursor-pointer"
                                >
                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 
                                                bg-[#0080ff]/10"
                                    >
                                        <img
                                            src={feature.icon}
                                            alt={feature.title}
                                            className="w-8 h-8 object-contain transition duration-500"
                                        />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-semibold mb-3 transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="transition-colors">{feature.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination dots */}
                <div className="flex justify-center mt-12 gap-3">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`transition-all rounded-full ${index === currentSlide
                                ? "w-6 h-3 bg-[#0080ff]"
                                : "w-3 h-3 bg-gray-300"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
