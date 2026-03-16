import { Star, Clock, Users } from "lucide-react"

export interface CourseCardProps {
    id: number
    title: string
    instructor: string
    image: string
    price: number
    rating: number
    reviews: number
    duration: string
    level: string
    category?: string
    students?: number
    progress?: number
    view?: "grid" | "list"
}

const CourseCard = ({
    id,
    title,
    instructor,
    image,
    price,
    rating,
    reviews,
    duration,
    level,
    category,
    students,
    progress,
    view = "grid",
}: CourseCardProps) => {
    const handleCourseClick = () => {
        // Simple navigation (you can replace with react-router navigate if using Router)
        window.location.href = `/course/${id}`
    }

    return (
        <div
            key={id}
            onClick={handleCourseClick}
            className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group
        ${view === "list" ? "flex h-48" : ""}`}
        >
            {/* Thumbnail */}
            <div
                className={`relative ${view === "list" ? "w-48 flex-shrink-0" : "h-48"
                    }`}
            >
                <img
                    src={image || "https://via.placeholder.com/300x200?text=Course"}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Duration */}
                <div className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-md shadow">
                    <Clock className="inline h-3 w-3 mr-1" />
                    {duration}
                </div>

                {/* Progress bar */}
                {typeof progress === "number" && (
                    <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/90 rounded-full p-1">
                            <div className="bg-gray-200 rounded-full h-1">
                                <div
                                    className="bg-[#0080FF] h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <span className="text-xs text-gray-600 mt-1 block">
                                {progress}% Complete
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className={`p-5 space-y-3 ${view === "list" ? "flex-1" : ""}`}>
                {/* Title + Category */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 group-hover:text-[#0080FF] transition-colors">
                        {title}
                    </h3>
                    {category && (
                        <span className="text-xs bg-[#0080FF]/10 text-[#0080FF] px-2 py-1 rounded-full whitespace-nowrap">
                            {category}
                        </span>
                    )}
                </div>

                {/* Instructor */}
                <p className="text-sm text-gray-600">{instructor}</p>

                {/* Rating */}
                <div className="flex items-center gap-2 text-sm">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="h-4 w-4"
                                fill={i < Math.floor(rating) ? "currentColor" : "none"}
                                stroke="currentColor"
                            />
                        ))}
                    </div>
                    <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
                    <span className="text-gray-500">({reviews.toLocaleString()})</span>
                </div>

                {/* Students */}
                {students !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>{students.toLocaleString()} students</span>
                    </div>
                )}

                
                <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-[#0080FF]">
                        ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs bg-[#0080FF]/10 text-[#0080FF] px-2 py-1 rounded-full">
                        {level}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default CourseCard
