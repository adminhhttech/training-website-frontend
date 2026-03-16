
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

export const DashboardMiddle = () => {
    const navigate = useNavigate()

    return (
        <div className="space-y-4">

            {/* ===== LABS CARD ===== */}
            <div className="space-y-2">
                <LabItem
                    img="/apti-lab.png"
                    title="Aptitude Lab"
                    desc="Strong aptitude fundamentals"
                    onClick={() => navigate("/aptitude")}
                />

                <LabItem
                    img="/softskills-lab.png"
                    title="Soft Skills Lab"
                    desc="Professional communication skills"
                    onClick={() => navigate("/softskills")}
                />

                <LabItem
                    img="/tech-lab.png"
                    title="Technical Lab"
                    desc="Core CS & technical subjects"
                    onClick={() => navigate("/technical")}
                />
            </div>

            {/* ===== MINI FEATURES ===== */}
            <div className="grid grid-cols-2 gap-3">
                <MiniFeature
                    img="/hht-bot.png"
                    title="Personal Assistant"
                    desc="Clear concepts through AI videos"
                    onClick={() => navigate("/personal-assistant")}
                />

                <MiniFeature
                    img="/hht-ytvideo.png"
                    title="Video Radar"
                    desc="Search videos instantly from courses"
                    onClick={() => navigate('/video-radar')}
                />
            </div>
        </div>
    )
}

/* ================= SUBCOMPONENTS ================= */

interface LabItemProps {
    img: string
    title: string
    desc: string
    onClick: () => void
}

export const LabItem = ({
    img,
    title,
    desc,
    onClick,
}: LabItemProps) => {
    return (
        <button
            onClick={onClick}
            className="
                w-full
                flex items-center gap-4
                p-4
                rounded-2xl
                bg-[#f3f8ff]
                hover:bg-[#e7f1ff]
                transition-colors
                text-left
            "
        >
            {/* ICON */}
            <div className="w-11 h-11 rounded-xl bg-[#e0efff] flex items-center justify-center flex-shrink-0">
                <img
                    src={img}
                    alt={title}
                    className="w-7 h-7 object-contain"
                />
            </div>

            {/* TEXT */}
            <div>
                <p className="text-lg font-semibold text-[#375A7E]">
                    {title}
                </p>
                <p className="text-xs text-[#375A7E]">
                    {desc}
                </p>
            </div>
        </button>
    )
}

interface MiniFeatureProps {
    img: string
    title: string
    desc: string
    onClick: () => void
}

const MiniFeature = ({
    img,
    title,
    desc,
    onClick,
}: MiniFeatureProps) => {
    return (
        <button
            onClick={onClick}
            className="
                rounded-2xl
                bg-white
                border
                shadow-sm
                p-4
                text-left
                hover:bg-gray-50
                transition-colors
            "
        >
            {/* IMAGE */}
            <div className="w-full aspect-square rounded-xl bg-[#eef6ff] flex items-center justify-center mb-2">
                <img
                    src={img}
                    alt={title}
                    className="w-16 h-16 object-contain select-none"
                />
            </div>

            {/* TEXT */}
            <p className="text-sm font-semibold text-[#375A7E]">
                {title}
            </p>
            <p className="text-xs text-[#375A7E] leading-snug">
                {desc}
            </p>
        </button>
    )
}
