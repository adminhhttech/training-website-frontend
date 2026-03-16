import { Card, CardContent } from "@/components/ui/card"
import { Course } from "./types"

interface RecommendedCoursesProps {
    courses: Course[]
    onCourseClick: (courseId: number) => void
}

export const RecommendedCourses = ({
    courses,
    onCourseClick,
}: RecommendedCoursesProps) => {
    const course = courses[1]
    if (!course) return null

    return (
        <Card
            className="
                rounded-2xl
                bg-white
                border
                shadow-sm
                hover:shadow-md
                transition-shadow
                cursor-pointer
            "
            onClick={() => onCourseClick(course.id)}
        >
            <CardContent className="p-4">
                {/* Header */}
                <h4 className="text-lg font-semibold text-[#375A7E] mb-3">
                    Recommended
                </h4>

                {/* Course Row */}
                <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Text */}
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#375A7E] leading-snug line-clamp-2">
                            {course.title}
                        </p>

                        <p className="text-xs text-[#375A7E] mt-1 truncate">
                            {course.instructor}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
