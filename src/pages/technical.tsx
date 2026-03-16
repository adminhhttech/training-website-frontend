

'use client';

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { ArrowLeft, Code, Database, Cpu, Server, Terminal, GitBranch, FileCode, Clock, ChevronRight, Users, CheckCircle, Building, Layers, Bug, DatabaseZap, Code2 } from "lucide-react"
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
    problems: number
    duration: number
    participants: number
    company: string
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
    "Programming": "bg-blue-50 text-blue-700",
    "DSA": "bg-purple-50 text-purple-700",
    "Database": "bg-emerald-50 text-emerald-700",
    "System Design": "bg-amber-50 text-amber-700",
    "Company": "bg-red-50 text-red-700",
    "Web Development": "bg-indigo-50 text-indigo-700",
    "DevOps": "bg-rose-50 text-rose-700",
    "Testing": "bg-cyan-50 text-cyan-700",
    "Data Structures": "bg-purple-50 text-purple-700",
    "Algorithms": "bg-indigo-50 text-indigo-700"
}

// Icon mapping for API categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    "Programming": <Code className="w-5 h-5" />,
    "Data Structures & Algorithms": <Layers className="w-5 h-5" />,
    "Web Development": <Code2 className="w-5 h-5" />,
    "Database": <Database className="w-5 h-5" />,
    "System Design": <Cpu className="w-5 h-5" />,
    "DevOps": <Server className="w-5 h-5" />,
    "Testing": <Bug className="w-5 h-5" />,
    "DSA": <Layers className="w-5 h-5" />,
    "Python": <FileCode className="w-5 h-5" />,
    "Git": <GitBranch className="w-5 h-5" />,
    "default": <Code className="w-5 h-5" />
}

// Category mapping for API titles
const mapCategoryFromTitle = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("data structure") || lowerTitle.includes("algorithm") || lowerTitle.includes("dsa")) {
        return "DSA"
    } else if (lowerTitle.includes("web") || lowerTitle.includes("full stack")) {
        return "Web Development"
    } else if (lowerTitle.includes("database") || lowerTitle.includes("sql") || lowerTitle.includes("mongodb")) {
        return "Database"
    } else if (lowerTitle.includes("system design") || lowerTitle.includes("scalable")) {
        return "System Design"
    } else if (lowerTitle.includes("python") || lowerTitle.includes("programming")) {
        return "Programming"
    } else if (lowerTitle.includes("devops") || lowerTitle.includes("cloud") || lowerTitle.includes("docker")) {
        return "DevOps"
    } else if (lowerTitle.includes("testing") || lowerTitle.includes("qa")) {
        return "Testing"
    } else if (lowerTitle.includes("git")) {
        return "Programming"
    }
    return "Programming"
}

// Reusable Card Component
const TechnicalCard: React.FC<{
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
                    <div className={`p-2 rounded-lg ${CATEGORY_COLORS[card.category] || CATEGORY_COLORS["Programming"]}`}>
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
                        {!isCourse && ` • ${(card as CompanyCard).company}`}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 group-hover:text-[#0080ff] transition-colors">
                        {card.title}
                    </h3>
                    {isCourse && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                            {(card as CourseCard).subtitle}
                        </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
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
                                {(card as CompanyCard).problems} coding problems
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
const TechnicalLab: React.FC = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<"courses" | "company">("courses")
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = React.useState("")
    const [coursesData, setCoursesData] = useState<CourseCard[]>([])
    const [error, setError] = useState<string | null>(null)

    // Fetch technical courses from API
    const fetchTechnicalCourses = async () => {
        try {
            setLoading(true)
            setError(null)
            console.log("Fetching technical courses from API...")
            
            // Using "Technical" category as per your endpoint
            const apiCourses = await api.getCoursesByCategory("Technical")
            console.log("API Response for Technical courses:", apiCourses)
            
            // Transform API data to CourseCard format
            const transformedCourses: CourseCard[] = apiCourses.map((course: ApiCourse) => {
                const category = mapCategoryFromTitle(course.title)
                return {
                    id: course._id,
                    type: "course" as const,
                    title: course.title,
                    subtitle: course.subtitle || "Master technical concepts",
                    description: course.description || "Enhance your technical skills with comprehensive learning",
                    difficulty: course.difficulty || "Intermediate",
                    modules: course.modules?.length || 0,
                    progress: course.totalCompletion || 0,
                    icon: CATEGORY_ICONS[category] || CATEGORY_ICONS.default,
                    category: category
                }
            })
            
            setCoursesData(transformedCourses)
            console.log("Transformed technical courses:", transformedCourses)
            
        } catch (err: any) {
            console.error("Error fetching technical courses:", err)
            setError(`Failed to load technical courses: ${err.message || "Please try again later."}`)
            // Fallback to empty array
            setCoursesData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTechnicalCourses()
    }, [])

    // Company Preparation Data (Static for now - can be moved to API later)
    const companyData: CompanyCard[] = [
        {
            id: "p1",
            type: "company",
            title: "Google Coding Interview Prep",
            description: "Google's coding interview patterns with LC hard problems and system design",
            problems: 75,
            duration: 120,
            difficulty: "Advanced",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 3240,
            company: "Google"
        },
        {
            id: "p2",
            type: "company",
            title: "Amazon SDE Technical Round",
            description: "Amazon's LP-based technical interviews with DSA and system design",
            problems: 65,
            duration: 90,
            difficulty: "Advanced",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 2870,
            company: "Amazon"
        },
        {
            id: "p3",
            type: "company",
            title: "Microsoft Technical Interview",
            description: "Microsoft coding challenges with focus on algorithms and problem-solving",
            problems: 60,
            duration: 85,
            difficulty: "Intermediate",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 2340,
            company: "Microsoft"
        },
        {
            id: "p4",
            type: "company",
            title: "Meta Coding Interview Prep",
            description: "Meta's coding interview patterns with emphasis on graphs and optimization",
            problems: 70,
            duration: 100,
            difficulty: "Advanced",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 1890,
            company: "Meta"
        },
        {
            id: "p5",
            type: "company",
            title: "TCS Digital Coding Test",
            description: "TCS Digital coding test pattern with CodeVita style problems",
            problems: 45,
            duration: 60,
            difficulty: "Intermediate",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 4120,
            company: "TCS"
        },
        {
            id: "p6",
            type: "company",
            title: "Infosys Power Programmer",
            description: "Infosys Power Programmer technical test with advanced DSA problems",
            problems: 50,
            duration: 75,
            difficulty: "Intermediate",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 2870,
            company: "Infosys"
        },
        {
            id: "p7",
            type: "company",
            title: "Wipro Elite Technical Test",
            description: "Wipro Elite NLTH technical assessment with coding and MCQ sections",
            problems: 40,
            duration: 50,
            difficulty: "Beginner",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 3560,
            company: "Wipro"
        },
        {
            id: "p8",
            type: "company",
            title: "Accenture Advanced Coding",
            description: "Accenture advanced coding test with problem-solving and debugging",
            problems: 55,
            duration: 65,
            difficulty: "Intermediate",
            icon: <Building className="w-5 h-5" />,
            category: "Company",
            participants: 3120,
            company: "Accenture"
        }
    ]

    // Handlers
    const handleCardClick = (id: string, type: "course" | "company") => {
        console.log(`[v0] Starting ${type}:`, id)
        if (type === "course") {
            navigate(`/course/${id}`)
        }
        // Company card click handler remains the same
    }

    const statsData = [
        {
            title: "Technical Courses",
            value: coursesData.length,
            icon: <Code className="w-8 h-8" />,
            color: PRIMARY_COLOR
        },
        {
            title: "Company Preparations",
            value: companyData.length,
            icon: <Building className="w-8 h-8" />,
            color: PRIMARY_COLOR
        },
        {
            title: "Active Coders",
            value: "18.7K",
            icon: <Users className="w-8 h-8" />,
            color: PRIMARY_COLOR
        },
        {
            title: "Placement Rate",
            value: "92%",
            icon: <CheckCircle className="w-8 h-8" />,
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
                                <h1 className="text-2xl font-bold text-gray-900">Technical Lab</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Master programming, DSA, system design, and technical skills for top companies
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
                                onClick={fetchTechnicalCourses}
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
                                Technical Courses
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
                                <TechnicalCard
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
                            <p className="text-gray-500">No technical courses available at the moment.</p>
                            <button
                                onClick={fetchTechnicalCourses}
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
                                    <h3 className="font-medium text-gray-900">Ready for technical interviews?</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {activeTab === "courses"
                                            ? "Build strong technical fundamentals with structured programming courses."
                                            : "Practice company-specific coding problems and system design questions."}
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
                                    Get Coding Schedule
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default TechnicalLab