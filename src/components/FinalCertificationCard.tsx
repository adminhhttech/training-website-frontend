"use client"

import type React from "react"
import { Award, Lock, CheckCircle } from "lucide-react"

interface FinalCertificationCardProps {
  isUnlocked: boolean
  isCompleted: boolean
  onStartCertification: () => void
}

export const FinalCertificationCard: React.FC<FinalCertificationCardProps> = ({
  isUnlocked,
  isCompleted,
  onStartCertification,
}) => {
  return (
    <div
      className={`relative border-2 rounded-2xl bg-white overflow-hidden transition-all duration-200 ${
        isUnlocked ? "border-[#0080ff]/30 hover:shadow-lg hover:-translate-y-1" : "border-gray-200 shadow-sm"
      }`}
    >
      {/* Gradient accent background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0080ff]/5 to-transparent pointer-events-none" />

      <div className="relative px-6 md:px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Left section: Icon and text */}
        <div className="flex items-start gap-5 flex-1">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              isCompleted ? "bg-green-100" : isUnlocked ? "bg-[#0080ff]/10" : "bg-gray-100"
            }`}
          >
            {isCompleted ? (
              <CheckCircle size={40} className="text-green-600" />
            ) : (
              <Award size={40} className={isUnlocked ? "text-[#0080ff]" : "text-gray-400"} />
            )}
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Final Certification Exam</h2>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              {isCompleted
                ? "You have successfully earned your course certificate! 🎉"
                : "Pass to earn your course certificate"}
            </p>
            {!isUnlocked && (
              <p className="text-xs text-gray-500 mt-3 font-medium">Complete all modules at 100% to unlock</p>
            )}
          </div>
        </div>

        {/* Right section: CTA Button */}
        <div className="flex-shrink-0">
          {isCompleted ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-green-50 border border-green-300 text-sm font-semibold text-green-700">
              <CheckCircle size={18} />
              Certified
            </div>
          ) : isUnlocked ? (
            <button
              onClick={onStartCertification}
              className="inline-flex items-center justify-center rounded-lg bg-[#0080ff] text-white text-sm font-semibold px-6 py-3 hover:bg-[#0080ff]/90 transition shadow-md whitespace-nowrap"
            >
              Start Certification
            </button>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-2 justify-center rounded-lg bg-gray-100 text-gray-500 text-sm font-semibold px-6 py-3 opacity-60 cursor-not-allowed whitespace-nowrap"
            >
              <Lock size={18} />
              Complete All Modules
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FinalCertificationCard
