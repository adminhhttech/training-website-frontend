import { LearningStat } from "./types"

interface LearningStatsProps {
    stats: LearningStat[]
}

export const LearningStats = ({ stats }: LearningStatsProps) => {
    return (
        <div className="mt-3 grid grid-cols-2 gap-2">

            {stats.map((stat) => {
                const Icon = stat.icon

                return (
                    <div
                        key={stat.label}
                        className="
                            relative
                            rounded-xl
                            px-3 py-2

                            text-center

                            bg-[rgba(240,248,255,0.75)]
                            backdrop-blur-md

                            border border-white/60

                            shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                            transition-all duration-200 ease-out

                            hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                            hover:-translate-y-[1px]
                        "
                    >
                        {/* Subtle inner highlight */}
                        <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent" />

                        <p className="relative text-xs text-[#375A7E]">
                            {stat.label}
                        </p>

                        <div className="relative flex items-center justify-center gap-2 mt-1">
                            <Icon className={`w-4 h-4 ${stat.color}`} />
                            <span className="text-lg font-semibold text-[#00a7ff]">
                                {stat.value}
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
