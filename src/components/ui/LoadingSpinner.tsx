"use client"

import { motion } from "framer-motion"
import { GraduationCap } from "lucide-react"

const LoadingSpinner = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
            {/* Outer rotating circle */}
            <motion.div
                className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center relative"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
                {/* Pulsing gradient background */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30"
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Graduation cap icon */}
                <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <GraduationCap className="w-10 h-10 text-primary drop-shadow-lg" />
                </motion.div>
            </motion.div>

            {/* Text */}
            <motion.p
                className="mt-6 text-lg font-medium text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                Loading your learning journey...
            </motion.p>
        </div>
    )
}

export default LoadingSpinner
