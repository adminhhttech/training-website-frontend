import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { LearningStat } from "./types"

interface DashboardHeaderProps {
    userName: string
    learningStats: LearningStat[]
}

export const DashboardHeader = ({
    userName,
    learningStats,
}: DashboardHeaderProps) => {
    const { user } = useAuth()
    const firstName = userName?.split(" ")[0]

    const getAvatarUrl = () => {
        const name = user?.name || "User"
        const seed = name.trim().split(/\s+/)[0].toLowerCase()
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`
    }

    return (
        <Card className="rounded-3xl bg-white border shadow-sm">
            <CardContent className="p-5">

                {/* ===== TOP SECTION ===== */}
                <div className="flex items-center gap-8 mb-5">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-[#eef4ff]">
                        <img
                            src={"/boyProfile.png"}
                            alt="User avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Greeting */}
<div className="leading-tight">
    <p className="text-2xl font-medium text-[#375A7E]">
        Hello,
    </p>
    <p className="text-2xl font-semibold text-[#00a7ff]">
        {firstName}
    </p>
</div>


                </div>

                {/* ===== STATS GRID ===== */}
                <div className="grid grid-cols-2 gap-3">
                    {learningStats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-xl bg-[#f1f7ff] p-4 text-center"
                        >
                            <p className="text-[11px] text-[#375A7E]">
                                {stat.label}
                            </p>
                            <p className="text-lg font-semibold text-[#00a7ff]">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

            </CardContent>
        </Card>
    )
}
