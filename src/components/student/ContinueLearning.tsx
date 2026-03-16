import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Course } from "./types"

interface ContinueLearningProps {
    currentCourse: Course | null
    onResumeClick: () => void
}

export const ContinueLearning = ({
    currentCourse,
    onResumeClick,
}: ContinueLearningProps) => {
    if (!currentCourse) return null

    return (
        <Card className="rounded-2xl bg-white border shadow-sm">
            <CardContent className="p-4 space-y-6">
                <h4 className="text-lg font-semibold text-[#375A7E] mb-4">
                    Continue learning
                </h4>

                <div className="flex items-center gap-4">
                    {/* Course Image */}
                    <div className="w-12 h-12 rounded-xl bg-[#eef4ff] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                            src={currentCourse.image || "/placeholder.svg"}
                            alt={currentCourse.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0B254B] truncate">
                            {currentCourse.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-[#375A7E]">
                                Progress
                            </span>
                            <span className="text-xs font-semibold text-[#00a7ff]">
                                {currentCourse.progress}%
                            </span>
                        </div>

                        <div className="mt-2 h-1.5 w-full bg-[#e6efff] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#00a7ff] rounded-full transition-all"
                                style={{ width: `${currentCourse.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <Button
                        size="sm"
                        className="
                            h-8
                            px-4
                            rounded-full
                            bg-[#00a7ff]
                            hover:bg-[#0066cc]
                            text-white
                            text-xs
                            font-medium
                        "
                        onClick={onResumeClick}
                    >
                        Resume
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Course Image */}
                    <div className="w-12 h-12 rounded-xl bg-[#eef4ff] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <img
                            src={"/course2.png"}
                            alt={currentCourse.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0B254B] truncate">
                            Complete Web Development Bootcamp
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-[#375A7E]">
                                Progress
                            </span>
                            <span className="text-xs font-semibold text-[#00a7ff]">
                                50%
                            </span>
                        </div>

                        <div className="mt-2 h-1.5 w-full bg-[#e6efff] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#00a7ff] rounded-full transition-all"
                                style={{ width: `50%` }}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <Button
                        size="sm"
                        className="
                            h-8
                            px-4
                            rounded-full
                            bg-[#00a7ff]
                            hover:bg-[#0066cc]
                            text-white
                            text-xs
                            font-medium
                        "
                        onClick={onResumeClick}
                    >
                        Resume
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
