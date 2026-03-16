import { Card, CardContent } from "@/components/ui/card"
import { Achievement } from "./types"
import { ChevronRight } from "lucide-react"

interface AchievementsProps {
    achievements: Achievement[]
    limit?: number
}

// Achievement PNG images array
const achievementImages = [
    "/achieve1.png",
    "/achieve2.png",
    "/achieve4.png",
]

export const Achievements = ({ achievements, limit = 3 }: AchievementsProps) => {
    const displayAchievements = achievements.slice(0, limit)

    return (
        <div className="space-y-4">
            {/* ================= LEADERBOARD CARD ================= */}
            <Card className="rounded-2xl bg-white border shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        {/* Left */}
                        <div>
                            <h4 className="text-lg font-semibold text-[#375A7E]">
                                Leaderboard
                            </h4>

                            <div className="mt-1">
                                <p className="text-sm font-bold text-[#00a7ff]">
                                    MASTER
                                </p>
                                <p className="text-[11px] text-[#375A7E]">
                                    Top 9%
                                </p>
                            </div>

                            <button className="mt-2 flex items-center text-[12px] text-[#00a7ff] hover:underline">
                                <span>Global leaderboard</span>
                                <ChevronRight className="w-3 h-3" />
                            </button>

                        </div>

                        {/* Trophy image */}
                        <div className="w-17 h-17 flex-shrink-0">
                            <img
                                src="/trophy.png"
                                alt="Trophy"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ================= ACHIEVEMENTS CARD ================= */}
            <Card className="rounded-2xl bg-white border shadow-sm">
                <CardContent className="p-4">
                    <h4 className="text-lg font-semibold text-[#375A7E]">
                        Achievements
                    </h4>

                    <div className="mt-3 grid grid-cols-3 gap-3">
                        {displayAchievements.map((achievement, index) => {
                            // Use PNG image from our array
                            const imageSrc = achievementImages[index % achievementImages.length]
                            
                            return (
                                <div
                                    key={achievement.id}
                                    className="
                                        flex flex-col items-center justify-center
                                        rounded-xl
                                        bg-[#f3f8ff]
                                        p-3
                                        transition-colors duration-200
                                        hover:bg-[#e1efff]
                                    "
                                >
                                    {/* Image container */}
                                    <div
                                        className="
                                            w-11 h-11
                                            rounded-xl
                                            bg-[#e8f3ff]
                                            flex items-center justify-center
                                            overflow-hidden
                                        "
                                    >
                                        <img
                                            src={imageSrc}
                                            alt={achievement.title}
                                            className="w-12 h-12 object-contain"
                                        />
                                    </div>

                                    <p className="mt-2 text-[10px] text-center text-[#375A7E] leading-tight">
                                        {achievement.title}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}