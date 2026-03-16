"use client"

import { Play, Building2 } from "lucide-react"

type Props = {
  company: any
  onStart: (config: {
    companyId: string
    topic: string
    difficulty: string
  }) => void
}

export default function CompanyPracticeCard({ company, onStart }: Props) {
  return (
    <div className="border rounded-xl bg-white p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-3">
        <Building2 className="text-[#0080ff]" />
        <h3 className="font-semibold">{company.name}</h3>
      </div>

      <div className="space-y-2 text-xs text-gray-600">
        <p>Topics: {company.topics.join(", ")}</p>
        <p>Difficulty: {company.difficulty.join(", ")}</p>
      </div>

      <button
        onClick={() =>
          onStart({
            companyId: company.id,
            topic: company.topics[0],
            difficulty: company.difficulty[0],
          })
        }
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-[#0080ff] text-white text-sm py-2 hover:bg-[#0080ff]/90"
      >
        <Play size={14} /> Practice Questions
      </button>
    </div>
  )
}
