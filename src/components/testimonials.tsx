"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Web Development Student",
        avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        content:
            "The courses are exceptionally well-structured and the instructors demonstrate deep expertise in their fields.",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Data Science Professional",
        avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        content:
            "The practical, hands-on approach to learning combined with real-world projects has been instrumental in advancing my career.",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Marketing Manager",
        avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        content:
            "The business courses provided me with actionable strategies that I immediately implemented in my role.",
    },
    {
        id: 4,
        name: "David Thompson",
        role: "Software Engineer",
        avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        content:
            "As a working professional, the flexible schedule and comprehensive curriculum allowed me to upskill without compromising my current responsibilities.",
    },
]

const TestimonialsSection = () => {
    const [index, setIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                setIndex((prev) => (prev + 1) % testimonials.length)
            }
        }, 4000)
        return () => clearInterval(interval)
    }, [isHovered])

    return (
        <section
            id="testimonials"
            className="py-20 bg-white"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-4">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Meet the Heroes</h2>
                    <p className="text-lg text-gray-600 mt-2">
                        On Weekend UX, instructors from all over the world instruct millions
                        of students. We offer the knowledge and abilities.
                    </p>
                </div>

                {/* Testimonial Slider */}
                <div className="relative max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={testimonials[index].id} // This ensures animation triggers on change
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.6 }}
                            className="rounded-xl bg-gray-50 p-8 text-center shadow-md"
                        >
                            <img
                                src={testimonials[index].avatar}
                                alt={testimonials[index].name}
                                className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
                            />
                            <h4 className="text-lg font-semibold text-gray-900">
                                {testimonials[index].name}
                            </h4>
                            <p className="text-[#0080ff] font-medium text-sm mb-3">
                                {testimonials[index].role}
                            </p>
                            <p className="text-gray-600 text-base leading-relaxed italic">
                                “{testimonials[index].content}”
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Pagination dots */}
                    <div className="flex justify-center mt-6 space-x-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(i)}
                                className={`h-3 w-3 rounded-full transition-all ${
                                    i === index ? "bg-[#0080ff] w-6" : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
