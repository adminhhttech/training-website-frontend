
'use client';

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { ArrowLeft, Users, MessageCircle, Presentation, Handshake, Target, Clock, ChevronRight, UserCheck, TrendingUp, Brain, BookOpen } from "lucide-react"
import { api, ApiCourse } from "../services/api"

// Types
interface BaseCard {
    id: string
    title: string
    description: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    icon: React.ReactNode
    category: string
}

interface CourseCard extends BaseCard {
    type: "course"
    subtitle: string
    modules: number
    progress: number
}

interface CompanyCard extends BaseCard {
    type: "company"
    scenarios: number
    duration: number
    participants: number
    company?: string
}

type CardData = CourseCard | CompanyCard

// Constants
const PRIMARY_COLOR = "#0080ff"
const PRIMARY_COLOR_HOVER = "#0066cc"

const DIFFICULTY_COLORS = {
    "Beginner": "bg-emerald-50 text-emerald-700 border border-emerald-200",
    "Intermediate": "bg-blue-50 text-blue-700 border border-blue-200",
    "Advanced": "bg-purple-50 text-purple-700 border border-purple-200"
}

const CATEGORY_COLORS: Record<string, string> = {
    "Communication": "bg-blue-50 text-blue-700",
    "Leadership": "bg-purple-50 text-purple-700",
    "Teamwork": "bg-emerald-50 text-emerald-700",
    "Problem Solving": "bg-amber-50 text-amber-700",
    "Interview": "bg-amber-50 text-amber-700",
    "Presentation": "bg-rose-50 text-rose-700",
    "Negotiation": "bg-indigo-50 text-indigo-700",
    "Company": "bg-red-50 text-red-700",
    "Mixed": "bg-gray-50 text-gray-700"
}

// Icon mapping for API categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Communication": <MessageCircle className="w-5 h-5" />,
    "Problem Solving": <Brain className="w-5 h-5" />,
    "Leadership": <Target className="w-5 h-5" />,
    "Teamwork": <Users className="w-5 h-5" />,
    "Interview": <UserCheck className="w-5 h-5" />,
    "Presentation": <Presentation className="w-5 h-5" />,
    "default": <BookOpen className="w-5 h-5" />
}

// Category mapping for API titles
const mapCategoryFromTitle = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("communication")) {
        return "Communication"
    } else if (lowerTitle.includes("problem") || lowerTitle.includes("critical")) {
        return "Problem Solving"
    } else if (lowerTitle.includes("leadership")) {
        return "Leadership"
    } else if (lowerTitle.includes("team")) {
        return "Teamwork"
    } else if (lowerTitle.includes("interview")) {
        return "Interview"
    } else if (lowerTitle.includes("presentation")) {
        return "Presentation"
    }
    return "Communication"
}

// Reusable Card Component
const SoftSkillsCard: React.FC<{
    card: CardData
    onClick: () => void
}> = ({ card, onClick }) => {
    const isCourse = card.type === "course"

    return (
        <div
            className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer"
            onClick={onClick}
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg ${CATEGORY_COLORS[card.category] || CATEGORY_COLORS.Mixed}`}>
                        <div className="w-5 h-5">
                            {card.icon}
                        </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${DIFFICULTY_COLORS[card.difficulty]}`}>
                        {card.difficulty}
                    </span>
                </div>

                {/* Content */}
                <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {card.category}
                        {(card as CompanyCard).company && ` • ${(card as CompanyCard).company}`}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 group-hover:text-[#0080ff] transition-colors">
                        {card.title}
                    </h3>
                    {isCourse && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {(card as CourseCard).subtitle}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3">
                        {card.description}
                    </p>
                </div>

                {/* Stats */}
                <div className="mb-4">
                    {isCourse ? (
                        <>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <span>{(card as CourseCard).modules} modules</span>
                                <span>{(card as CourseCard).progress}% completed</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                <div
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(card as CourseCard).progress}%`,
                                        backgroundColor: PRIMARY_COLOR
                                    }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{(card as CompanyCard).duration} min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{(card as CompanyCard).participants.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                {(card as CompanyCard).scenarios} scenarios
                            </div>
                        </>
                    )}
                </div>

                {/* Action Button */}
                <button
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 transition-colors group-hover:border-gray-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                >
                    {isCourse
                        ? ((card as CourseCard).progress > 0 ? "Continue" : "Start Learning")
                        : "Start Preparation"
                    }
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// Skeleton Loader Component
const SkeletonLoader: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
            <div
                key={i}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
            >
                <div className="p-5 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-200 rounded-lg" />
                </div>
            </div>
        ))}
    </div>
)

// Stats Card Component
const StatsCard: React.FC<{
    title: string
    value: string | number
    icon: React.ReactNode
    color: string
}> = ({ title, value, icon, color }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div style={{ color }} className="opacity-80">
                {icon}
            </div>
        </div>
    </div>
)

// Tab Button Component
const TabButton: React.FC<{
    active: boolean
    onClick: () => void
    children: React.ReactNode
}> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 font-medium text-sm transition-colors relative ${active
                ? "text-[#0080ff]"
                : "text-gray-500 hover:text-gray-700"
            }`}
    >
        {children}
        {active && (
            <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: PRIMARY_COLOR }}
            />
        )}
    </button>
)

// Main Component
const SoftSkillsLab: React.FC = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<"courses" | "company">("courses")
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = React.useState("")
    const [coursesData, setCoursesData] = useState<CourseCard[]>([])
    const [error, setError] = useState<string | null>(null)

    // Fetch soft skills courses from API
    const fetchSoftSkillsCourses = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log("Fetching soft skills courses from API...")
            
            const apiCourses = await api.getCoursesByCategory("SoftSkills")
            console.log("API Response:", apiCourses)
            
            // Transform API data to CourseCard format
            const transformedCourses: CourseCard[] = apiCourses.map((course) => {
                const category = mapCategoryFromTitle(course.title)
                return {
                    id: course._id,
                    type: "course" as const,
                    title: course.title,
                    subtitle: course.subtitle || "Master soft skills concepts",
                    description: course.description || "Enhance your soft skills with comprehensive learning",
                    difficulty: course.difficulty || "Beginner",
                    modules: course.modules?.length || 3,
                    progress: course.totalCompletion || 0,
                    icon: CATEGORY_ICONS[category] || CATEGORY_ICONS.default,
                    category: category
                }
            })
            
            setCoursesData(transformedCourses)
            console.log("Transformed courses:", transformedCourses)
            
        } catch (err: any) {
            console.error("Error fetching soft skills courses:", err)
            setError(`Failed to load soft skills courses: ${err.message || "Please try again later."}`)
            setCoursesData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSoftSkillsCourses()
    }, [])

    // Company Preparation Data (Static for now - can be moved to API later)
    const companyData: CompanyCard[] = [
        {
            id: "p1",
            type: "company",
            title: "TCS HR Interview Simulation",
            description: "Practice common TCS HR interview questions with AI-powered feedback",
            scenarios: 25,
            duration: 45,
            difficulty: "Intermediate",
            icon: <MessageCircle className="w-5 h-5" />,
            category: "Interview",
            participants: 1560,
            company: "TCS"
        },
        {
            id: "p2",
            type: "company",
            title: "Infosys Group Discussion Practice",
            description: "Simulate Infosys group discussion rounds with peer evaluation",
            scenarios: 15,
            duration: 30,
            difficulty: "Intermediate",
            icon: <Users className="w-5 h-5" />,
            category: "Communication",
            participants: 1240,
            company: "Infosys"
        },
        {
            id: "p3",
            type: "company",
            title: "Wipro Leadership Scenario Test",
            description: "Case-based leadership scenarios specific to Wipro's assessment",
            scenarios: 20,
            duration: 40,
            difficulty: "Advanced",
            icon: <Target className="w-5 h-5" />,
            category: "Leadership",
            participants: 890,
            company: "Wipro"
        },
        {
            id: "p4",
            type: "company",
            title: "Accenture Client Presentation",
            description: "Practice client presentation scenarios as per Accenture standards",
            scenarios: 12,
            duration: 35,
            difficulty: "Intermediate",
            icon: <Presentation className="w-5 h-5" />,
            category: "Presentation",
            participants: 1120,
            company: "Accenture"
        }
    ]

    // Handlers
    const handleCardClick = (id: string, type: "course" | "company") => {
        console.log(`[v0] Starting ${type}:`, id)
        if (type === "course") {
            navigate(`/course/${id}`)
        }
    }

    const statsData = [
        {
            title: "Soft Skills Courses",
            value: coursesData.length,
            icon: <MessageCircle className="w-8 h-8" />,
            color: PRIMARY_COLOR
        },
        {
            title: "Company Preparations",
            value: companyData.length,
            icon: <Target className="w-8 h-8" />,
            color: PRIMARY_COLOR
        },
        {
            title: "Active Learners",
            value: "8.7K",
            icon: <Users className="w-8 h-8" />,
            color: PRIMARY_COLOR
        },
        {
            title: "Success Rate",
            value: "94%",
            icon: <TrendingUp className="w-8 h-8" />,
            color: PRIMARY_COLOR
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar - Fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar search={search} setSearch={setSearch} />
            </div>

            {/* Main Content - Pushed down by navbar height */}
            <div className="pt-16">
                {/* Header */}
                <header className="bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition flex-shrink-0"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Soft Skills Lab</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Master communication, leadership, and interpersonal skills for career success
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    {/* Stats Overview */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {statsData.map((stat, index) => (
                            <StatsCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                            <button
                                onClick={fetchSoftSkillsCourses}
                                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="mb-8">
                        <div className="flex border-b border-gray-200">
                            <TabButton
                                active={activeTab === "courses"}
                                onClick={() => setActiveTab("courses")}
                            >
                                Skills Courses
                            </TabButton>
                            <TabButton
                                active={activeTab === "company"}
                                onClick={() => setActiveTab("company")}
                            >
                                Company Preparation
                            </TabButton>
                        </div>
                    </div>

                    {/* Content Grid */}
                    {loading ? (
                        <SkeletonLoader />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {(activeTab === "courses" ? coursesData : companyData).map((card) => (
                                <SoftSkillsCard
                                    key={card.id}
                                    card={card}
                                    onClick={() => handleCardClick(card.id, card.type)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && coursesData.length === 0 && activeTab === "courses" && !error && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No soft skills courses available at the moment.</p>
                            <button
                                onClick={fetchSoftSkillsCourses}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Refresh
                            </button>
                        </div>
                    )}

                    {/* Footer Info */}
                    {!loading && (
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <h3 className="font-medium text-gray-900">Ready to ace your interviews?</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {activeTab === "courses"
                                            ? "Master essential soft skills to stand out in the workplace."
                                            : "Practice company-specific scenarios to excel in interviews and assessments."}
                                    </p>
                                </div>
                                <button
                                    className="px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors border"
                                    style={{
                                        backgroundColor: PRIMARY_COLOR,
                                        borderColor: PRIMARY_COLOR
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = PRIMARY_COLOR_HOVER;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
                                    }}
                                >
                                    Get Personalized Coaching
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default SoftSkillsLab