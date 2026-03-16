// coursePage.tsx 
"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    Play,
    Code,
    FileText,
    Clock,
    Users,
    Zap,
    ChevronDown,
    ChevronUp,
    CheckSquare,
    FileCheck2,
    Award,
    AlertCircle,
    Lock,
} from "lucide-react"
import { ContentBlock, Module, Course, CourseDifficulty } from "../data/courseData"
import Navbar from "@/components/Navbar"
import LessonOverlay from "./LessonOverlay"
import FullScreenTest from "@/components/FullScreenTest"
import TestLoadingState from "@/components/TestLoadingState"
import { useAIMockTest } from "@/hooks/useAIMockTest"
import type { TestQuestion, TestConfig } from "@/components/FullScreenTest"
import { useToast } from "@/hooks/use-toast"
import { clearTestFromCache } from "@/services/AIMockTestService"
import { api, type ApiCourse, type ApiModule, type ApiContentBlock } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

// Helper function to map API data to local types
const mapApiCourseToExtendedCourse = (apiCourse: ApiCourse): ExtendedCourse => {
    const totalMinutes = apiCourse.modules.reduce((total, module) => {
        const match = module.duration.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/)
        let hours = 0, minutes = 0
        if (match) {
            hours = parseInt(match[1] || "0")
            minutes = parseInt(match[2] || "0")
        }
        return total + hours * 60 + minutes
    }, 0)

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`

    return {
        id: apiCourse._id,
        title: apiCourse.title,
        subtitle: apiCourse.subtitle,
        description: apiCourse.description,
        totalCompletion: apiCourse.totalCompletion,
        instructor: apiCourse.instructor,
        prerequisites: apiCourse.prerequisites,
        relatedCourses: apiCourse.relatedCourses,
        previewVideoUrl: apiCourse.previewVideoUrl,
        difficulty: apiCourse.difficulty,
        updatedAt: apiCourse.updatedAt,
        duration: duration,
        participants: 1250,
        collaborators: [],
        modules: apiCourse.modules.map(mapApiModuleToExtendedModule),
    }
}

const mapApiModuleToExtendedModule = (apiModule: ApiModule): ExtendedModule => {
    return {
        id: apiModule._id,
        title: apiModule.title,
        description: apiModule.description,
        duration: apiModule.duration,
        completionPercentage: apiModule.completionPercentage,
        content: apiModule.content.map(mapApiContentBlockToExtended),
    }
}

const mapApiContentBlockToExtended = (apiBlock: ApiContentBlock): ExtendedContentBlock => {
    const baseBlock = {
        id: apiBlock._id,
        type: apiBlock.type,
        title: apiBlock.title,
        duration: apiBlock.duration,
        data: apiBlock.data,
    }

    if (apiBlock.type === 'video') {
        return {
            ...baseBlock,
            url: apiBlock.data?.url,
        } as ExtendedContentBlock
    } else if (apiBlock.type === 'mcq') {
        return {
            ...baseBlock,
            question: apiBlock.data?.question,
            options: apiBlock.data?.options,
            correctAnswerIndex: apiBlock.data?.correctAnswerIndex,
        } as ExtendedContentBlock
    } else if (apiBlock.type === 'coding') {
        return {
            ...baseBlock,
            snippet: apiBlock.data?.snippet,
            instructions: apiBlock.data?.instructions,
            language: apiBlock.data?.language,
            pdfPath: apiBlock.data?.pdfPath,
        } as ExtendedContentBlock
    } else if (apiBlock.type === 'theory') {
        return {
            ...baseBlock,
            content: apiBlock.data?.text,
            visualSummaryTitle: apiBlock.data?.visualSummaryTitle,
            items: apiBlock.data?.items,
            keyTakeaway: apiBlock.data?.keyTakeaway,
        } as ExtendedContentBlock
    }

    return baseBlock as ExtendedContentBlock
}

type ExtendedContentBlock = ContentBlock & {
    duration?: string
    url?: string
    question?: string
    options?: string[]
    correctAnswerIndex?: number
    snippet?: string
    instructions?: string[]
    language?: string
    content?: string
    visualSummaryTitle?: string
    keyTakeaway?: string
    pdfPath?: string
    items?: Array<{
        label: string
        color: string
        text: string
        border: string
    }>
}

type ExtendedModule = Omit<Module, "content"> & {
    description?: string
    content: ExtendedContentBlock[]
}

type ExtendedCourse = Omit<Course, "modules"> & {
    updatedAt?: string
    participants?: number
    duration?: string
    collaborators?: string[]
    relatedCourses?: string[]
    modules: ExtendedModule[]
}

const DescriptionSection = ({ description }: { description: string }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="bg-white border border-gray-200/70 rounded-xl p-5">
            <h2 className="text-base font-semibold mb-3">Description</h2>

            <div className="relative">
                <p
                    className={`text-sm text-gray-700 leading-relaxed transition-all duration-200 ${isExpanded ? "" : "line-clamp-2"
                        }`}
                >
                    {description}
                </p>

                {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                )}
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-4 text-xs font-semibold text-[#0080ff] rounded-full px-3 py-2 inline-flex items-center gap-1 hover:bg-[#0080ff]/10 transition-colors"
            >
                {isExpanded ? "Read less" : "Read more"}
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
        </div>
    )
}

const LessonRow = ({
    type,
    title,
    duration,
    onClick,
}: {
    type: string
    title: string
    duration?: string
    onClick: () => void
}) => {
    const Icon = type === "video" ? Play : type === "coding" ? Code : type === "mcq" ? CheckSquare : FileText

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition group"
        >
            <div className="flex items-center gap-3">
                <span className="text-[#0080ff]">
                    <Icon size={14} />
                </span>
                <span className="text-gray-800 group-hover:text-[#0080ff] transition-colors">{title}</span>
            </div>
            {duration && <span className="text-xs text-gray-400 font-medium">{duration}</span>}
        </button>
    )
}

const ChapterCard = ({
    module,
    index,
    testResults,
    onLessonSelect,
    onStartTest,
    onReviewTest,
}: {
    module: ExtendedModule
    index: number
    testResults?: { score: number; passed: boolean; completedAt: Date }
    onLessonSelect: (block: ExtendedContentBlock) => void
    onStartTest: () => void
    onReviewTest: () => void
}) => {
    const [isExpanded, setIsExpanded] = useState(index === 0)
    const completed = module.completionPercentage || 0
    const primaryLesson = module.content[0]

    return (
        <div className="space-y-4">
            <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-gray-800 bg-[#0080ff]/10">
                            {index + 1}
                        </span>
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 font-Poppins">{module.title}</h3>
                    </div>

                    <div className="flex flex-col items-end gap-1 min-w-48">
                        <div className="flex items-center gap-2">
                            <div className="w-48 h-2 rounded-full bg-gray-200 overflow-hidden">
                                <div className="h-full rounded-full bg-[#0080ff]/60" style={{ width: `${completed}%` }} />
                            </div>
                            <span className="text-[11px] font-medium text-gray-500">{completed}%</span>
                        </div>
                    </div>
                </div>

                {module.description && (
                    <p className="px-5 text-sm text-gray-700 pb-4 border-b border-gray-100">{module.description}</p>
                )}

                <div className="px-5 py-3 flex items-center justify-between gap-4">
                    <button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg text-[#0080ff] bg-white text-xs font-semibold px-3 py-2 hover:bg-[#0080ff]/5 transition"
                    >
                        {isExpanded ? "Hide Chapter Details" : "View Chapter Details"}
                        {isExpanded ? <ChevronUp size={14} className="shrink-0" /> : <ChevronDown size={14} className="shrink-0" />}
                    </button>

                    {isExpanded && (
                        <button
                            onClick={() => primaryLesson && onLessonSelect(primaryLesson)}
                            className="inline-flex items-center justify-center rounded-lg bg-[#0080ff] text-white text-xs font-semibold px-4 py-2.5 hover:bg-[#0080ff]/90 transition shadow-sm"
                        >
                            {completed > 0 ? "Continue Chapter" : "Start Chapter"}
                        </button>
                    )}
                </div>

                {isExpanded && (
                    <div className="border-t border-gray-100">
                        {module.content.map((lesson) => (
                            <LessonRow
                                key={lesson.id}
                                type={lesson.type}
                                title={lesson.title}
                                duration={lesson.duration}
                                onClick={() => onLessonSelect(lesson)}
                            />
                        ))}

                        <div className="border-t border-gray-100 px-4 py-4 bg-[#0080ff]/2">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Module {index + 1} Assessment Test</h4>
                                    <p className="text-xs text-gray-600 mb-2">Test your understanding</p>
                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                        <span>10 Questions</span>
                                        <span>30 Minutes</span>
                                        <span>70% to Pass</span>
                                    </div>
                                    {testResults && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-xs font-medium text-gray-700">Your Score:</span>
                                            <span className="text-xs font-bold text-[#0080ff]">{testResults.score.toFixed(1)}%</span>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#0080ff]/10 text-[#0080ff]">
                                                {testResults.passed ? "Passed" : "Try Again"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-shrink-0">
                                    {testResults ? (
                                        <button
                                            onClick={onReviewTest}
                                            className="inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-2 hover:bg-gray-200 transition whitespace-nowrap"
                                        >
                                            Review
                                        </button>
                                    ) : (
                                        <button
                                            onClick={onStartTest}
                                            className="inline-flex items-center justify-center rounded-lg bg-[#0080ff] text-white text-xs font-semibold px-3 py-2 hover:bg-[#0080ff]/90 transition whitespace-nowrap"
                                        >
                                            Start Test
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const CoursePageLoading = () => (
    <div className="min-h-screen bg-[#f7f9fc]">
        <div className="fixed top-0 left-0 right-0 z-30 h-14 sm:h-16 bg-white/90 backdrop-blur shadow-sm">
            <Navbar />
        </div>

        <main className="pt-24 pb-16">
            <div className="px-10 space-y-5">
                <div className="bg-[#0080ff] text-white rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="space-y-4">
                            <div className="h-8 w-3/4 bg-blue-300/50 rounded animate-pulse"></div>
                            <div className="h-4 w-1/2 bg-blue-300/50 rounded animate-pulse"></div>
                            <div className="h-6 w-32 bg-blue-300/50 rounded-full animate-pulse"></div>
                            <div className="flex flex-wrap gap-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-10 w-24 bg-blue-300/50 rounded-full animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-[1fr_minmax(0,280px)] lg:gap-5 lg:items-start">
                    <div className="space-y-5">
                        <div className="bg-white border border-gray-200/70 rounded-xl p-5">
                            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>

                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl bg-white shadow-sm animate-pulse">
                                <div className="px-5 pt-4 pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="h-2 w-48 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="space-y-5 lg:mt-0">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200/70 rounded-xl p-4">
                                <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-full bg-gray-200 rounded"></div>
                                    <div className="h-3 w-5/6 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </aside>
                </div>
            </div>
        </main>
    </div>
)

const CoursePageError = ({ 
    error, 
    onRetry, 
    isAuthError, 
    isAccessError 
}: { 
    error: string; 
    onRetry: () => void;
    isAuthError?: boolean;
    isAccessError?: boolean;
}) => {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-[#f7f9fc]">
            <div className="fixed top-0 left-0 right-0 z-30 h-14 sm:h-16 bg-white/90 backdrop-blur shadow-sm">
                <Navbar />
            </div>

            <main className="pt-24 pb-16">
                <div className="px-10">
                    <div className={`bg-white border rounded-2xl p-8 text-center ${
                        isAuthError ? 'border-orange-200' : 
                        isAccessError ? 'border-purple-200' : 
                        'border-red-200'
                    }`}>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                            isAuthError ? 'bg-orange-100' : 
                            isAccessError ? 'bg-purple-100' : 
                            'bg-red-100'
                        }`}>
                            {isAccessError ? (
                                <Lock className="h-8 w-8 text-purple-600" />
                            ) : (
                                <AlertCircle className={`h-8 w-8 ${
                                    isAuthError ? 'text-orange-600' : 'text-red-600'
                                }`} />
                            )}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            {isAuthError ? "Authentication Required" : 
                             isAccessError ? "Access Denied" : 
                             "Failed to Load Course"}
                        </h2>
                        <p className="text-gray-600 mb-6">
                            {isAuthError 
                                ? "You need to be logged in to access this course. Please sign in to continue."
                                : isAccessError
                                ? "You don't have permission to access this course. Please contact support or check your subscription."
                                : error
                            }
                        </p>
                        <div className="flex gap-4 justify-center">
                            {isAuthError ? (
                                <>
                                    <button
                                        onClick={() => navigate("/signin")}
                                        className="inline-flex items-center justify-center rounded-lg bg-[#0080ff] text-white font-semibold px-6 py-2 hover:bg-[#0080ff]/90 transition"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={() => navigate("/signup")}
                                        className="inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 font-semibold px-6 py-2 hover:bg-gray-200 transition"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            ) : isAccessError ? (
                                <>
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="inline-flex items-center justify-center rounded-lg bg-[#0080ff] text-white font-semibold px-6 py-2 hover:bg-[#0080ff]/90 transition"
                                    >
                                        Back to Dashboard
                                    </button>
                                    <button
                                        onClick={() => navigate("/courses")}
                                        className="inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 font-semibold px-6 py-2 hover:bg-gray-200 transition"
                                    >
                                        Browse Courses
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={onRetry}
                                        className="inline-flex items-center justify-center rounded-lg bg-[#0080ff] text-white font-semibold px-6 py-2 hover:bg-[#0080ff]/90 transition"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className="inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 font-semibold px-6 py-2 hover:bg-gray-200 transition"
                                    >
                                        Back to Dashboard
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

const CoursePage = () => {
    const { courseId } = useParams<{ courseId: string }>()
    const navigate = useNavigate()
    const { user, isLoading: authLoading } = useAuth()
    const [course, setCourse] = useState<ExtendedCourse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isAuthError, setIsAuthError] = useState(false)
    const [isAccessError, setIsAccessError] = useState(false)

    const {
        isLoading: isTestLoading,
        error: testError,
        currentTest,
        loadModuleTest,
        loadFinalTest,
        clearTest,
        clearError,
        retryTest,
    } = useAIMockTest()

    const [activeLesson, setActiveLesson] = useState<ExtendedContentBlock | null>(null)
    const [activeTest, setActiveTest] = useState<{
        config: TestConfig
        questions: TestQuestion[]
    } | null>(null)

    const [pendingTest, setPendingTest] = useState<{
        type: "module" | "final"
        moduleIndex?: number
        moduleId?: string
    } | null>(null)

    const [moduleTestScores, setModuleTestScores] = useState<
        Record<
            string,
            {
                score: number
                passed: boolean
                completedAt: Date
            }
        >
    >({})

    const [finalCertification, setFinalCertification] = useState<{
        score: number
        passed: boolean
        completedAt: Date
    } | null>(null)

    const [isDemoMode] = useState(true)

    const moduleTitles = [
        "OpenAI API integration - including API key setup, making HTTP requests to OpenAI, parsing JSON responses, handling authentication errors, rate limiting strategies, token management, and structuring Python or JavaScript applications",
        "OpenAI function calling - including defining function schemas, extracting structured data from natural language, integrating external APIs and tools, handling function call responses, and chaining multiple function calls",
        "Production AI applications - including content moderation, input validation and sanitization, prompt injection prevention, testing AI systems, monitoring and logging, cost optimization, and safety measures",
    ]

    const fetchCourseData = async () => {
        if (!courseId) {
            setError("Course ID not found in URL")
            setLoading(false)
            return
        }

        if (!user) {
            setIsAuthError(true)
            setError("You need to be logged in to access this course")
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)
            setIsAuthError(false)
            setIsAccessError(false)

            const apiCourse = await api.getCourseById(courseId)

            const extendedCourse = mapApiCourseToExtendedCourse(apiCourse)
            setCourse(extendedCourse)
        } catch (err: any) {
            console.error('Failed to fetch course:', err)
            
            // Check if it's an authentication error (401)
            if (err.status === 401) {
                setIsAuthError(true)
                setError("Authentication failed. Please sign in again.")
            } 
            // Check if it's an access error (403)
            else if (err.status === 403) {
                setIsAccessError(true)
                setError("You don't have permission to access this course. Please check your subscription or contact support.")
            } else {
                setError(err.message || 'Failed to load course. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            fetchCourseData()
        }
    }, [courseId, authLoading, user])

    useEffect(() => {
        if (currentTest) {
            setActiveTest(currentTest)
            setPendingTest(null)
        }
    }, [currentTest])

    useEffect(() => {
        if (activeLesson || activeTest || isTestLoading) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [activeLesson, activeTest, isTestLoading])

    const getFlatContent = () => course?.modules.flatMap((m) => m.content) || []

    const navigateLesson = (direction: number) => {
        if (!activeLesson || !course) return
        const flat = getFlatContent()
        const idx = flat.findIndex((b) => b.id === activeLesson.id)
        if (idx === -1) return
        const newIdx = idx + direction
        if (newIdx < 0 || newIdx >= flat.length) return
        setActiveLesson(flat[newIdx])
    }

    const stats = useMemo(() => {
        if (!course) return { videos: 0, exercises: 0 }

        let videos = 0
        let exercises = 0

        course.modules.forEach((mod) => {
            mod.content.forEach((block) => {
                if (block.type === "video") {
                    videos++
                } else if (block.type === "coding" || block.type === "mcq") {
                    exercises++
                }
            })
        })

        return { videos, exercises }
    }, [course])

    const handleLessonComplete = (blockId: string) => {
        console.log(`Lesson ${blockId} completed`)
        setActiveLesson(null)
    }

    const handleStartModuleTest = async (moduleId: string, moduleIndex: number) => {
        setPendingTest({ type: "module", moduleIndex, moduleId })
        try {
            await loadModuleTest(moduleIndex, moduleTitles[moduleIndex])
        } catch (error) {
            console.error("Failed to load module test:", error)
        }
    }

    const handleReviewModuleTest = async (moduleId: string, moduleIndex: number) => {
        setPendingTest({ type: "module", moduleIndex, moduleId })
        try {
            await loadModuleTest(moduleIndex, moduleTitles[moduleIndex])
        } catch (error) {
            console.error("Failed to load module test:", error)
        }
    }

    const handleStartCertification = async () => {
        if (!course) return

        setPendingTest({ type: "final" })
        try {
            await loadFinalTest(course.title, moduleTitles)
        } catch (error) {
            console.error("Failed to load final test:", error)
        }
    }

    const handleReviewCertification = async () => {
        if (!course) return

        setPendingTest({ type: "final" })
        try {
            await loadFinalTest(course.title, moduleTitles)
        } catch (error) {
            console.error("Failed to load final test:", error)
        }
    }

    const handleRetryTest = async () => {
        clearError()
        if (!course) return

        if (pendingTest?.type === "module" && pendingTest.moduleIndex !== undefined) {
            await loadModuleTest(pendingTest.moduleIndex, moduleTitles[pendingTest.moduleIndex])
        } else if (pendingTest?.type === "final") {
            await loadFinalTest(course.title, moduleTitles)
        }
    }

    const { toast } = useToast()

    const handleTestComplete = (results: {
        score: number
        passed: boolean
        correctCount: number
        totalQuestions: number
        timeSpent: number
        answers: Array<any>
    }) => {
        if (activeTest?.config.type === "module") {
            const moduleId = pendingTest?.moduleId || `mod-${activeTest.config.id.split("-")[1]}`
            const moduleIndex = pendingTest?.moduleIndex

            setModuleTestScores((prev) => ({
                ...prev,
                [moduleId]: {
                    score: results.score,
                    passed: results.passed,
                    completedAt: new Date(),
                },
            }))

            toast({
                title: results.passed ? "Test Passed! 🎉" : "Test Not Passed",
                description: `You scored ${results.score.toFixed(1)}%. ${results.passed
                    ? "Great job! You can proceed to the next module."
                    : `You need ${activeTest.config.passingScore}% to pass. Try again!`
                    }`,
                variant: results.passed ? "default" : "destructive",
            })

            if (moduleIndex !== undefined) {
                clearTestFromCache(`module-${moduleIndex}`)
                console.log(`[CoursePage] Cleared cache for module-${moduleIndex}`)
            }
        } else if (activeTest?.config.type === "final") {
            setFinalCertification({
                score: results.score,
                passed: results.passed,
                completedAt: new Date(),
            })

            toast({
                title: results.passed ? "Certification Earned! 🏆" : "Certification Not Passed",
                description: results.passed
                    ? `Congratulations! You've completed the course with ${results.score.toFixed(1)}%!`
                    : `You need ${activeTest.config.passingScore}% to earn your certificate. Keep trying!`,
                variant: results.passed ? "default" : "destructive",
            })

            clearTestFromCache("final-certification")
            console.log(`[CoursePage] Cleared cache for final-certification`)
        }

        setActiveTest(null)
        clearTest()
    }

    const handleTestClose = () => {
        setActiveTest(null)
        setPendingTest(null)
        clearTest()
        clearError()
    }

    const calculateOverallProgress = () => {
        if (!course) return 0

        const moduleProgress =
            course.modules.reduce((sum, mod) => sum + (mod.completionPercentage || 0), 0) / course.modules.length
        const moduleTestsCount = Object.keys(moduleTestScores).length
        const testBonus = (moduleTestsCount / course.modules.length) * 10
        const finalBonus = finalCertification?.passed ? 10 : 0

        return Math.min(100, moduleProgress + testBonus + finalBonus)
    }

    const overallProgress = calculateOverallProgress()

    if (authLoading) {
        return <CoursePageLoading />
    }

    if (loading) {
        return <CoursePageLoading />
    }

    if (error || !course) {
        return <CoursePageError 
            error={error || "Course not found"} 
            onRetry={fetchCourseData}
            isAuthError={isAuthError}
            isAccessError={isAccessError}
        />
    }

    return (
        <div className="min-h-screen bg-[#f7f9fc] text-gray-900">
            <div className="fixed top-0 left-0 right-0 z-30 h-14 sm:h-16 bg-white/90 backdrop-blur shadow-sm">
                <Navbar />
            </div>

            <main className="pt-24 pb-16">
                <div className="px-10 space-y-5">
                    <section className="bg-[#0080ff] text-white rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-semibold">{course.title}</h1>

                                <p className="text-sm md:text-base text-blue-50/90 max-w-xl mb-1">{course.subtitle}</p>

                                {course.difficulty && (
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`
                        inline-flex items-center bg-white gap-1 px-3 py-1 rounded-full
                        text-[11px] font-semibold border border-white/20 backdrop-blur tracking-wide
                        text-[#0080ff]
                      `}
                                        >
                                            {course.difficulty}

                                            <div className="flex items-center gap-1 ml-1">
                                                {["Beginner", "Intermediate", "Advanced"].map((level) => {
                                                    const isFilled =
                                                        (course.difficulty === "Beginner" && level === "Beginner") ||
                                                        (course.difficulty === "Intermediate" &&
                                                            (level === "Beginner" || level === "Intermediate")) ||
                                                        course.difficulty === "Advanced"

                                                    return (
                                                        <span
                                                            key={level}
                                                            className={` w-2 h-2 rounded-full ${isFilled ? "bg-[#0080ff]" : "border border-[#0080ff]"
                                                                }`}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm mt-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-blue-50 border border-white/10">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                                            <Clock size={14} />
                                        </span>
                                        <span className="font-medium">{course.duration || `${course.modules.length} modules`}</span>
                                    </div>

                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-blue-50 border border-white/10">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                                            <Play size={14} />
                                        </span>
                                        <span className="font-medium">{stats.videos} videos</span>
                                    </div>

                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-blue-50 border border-white/10">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                                            <FileCheck2 size={14} />
                                        </span>
                                        <span className="font-medium">{stats.exercises} exercises</span>
                                    </div>

                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-blue-50 border border-white/10">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                                            <Award size={14} />
                                        </span>
                                        <span className="font-medium">{course.modules.length + 1} Assessments</span>
                                    </div>

                                    {course.participants && (
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-blue-50 border border-white/10">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10">
                                                <Users size={14} />
                                            </span>
                                            <span className="font-medium">{course.participants.toLocaleString()} learners</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 max-w-md">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-blue-100 font-medium">Course Progress</span>
                                        <span className="text-xs text-blue-100 font-bold">{Math.round(overallProgress)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-500"
                                            style={{ width: `${overallProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 md:items-end">
                                <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#0080ff] font-semibold text-sm px-5 py-2 shadow-sm hover:bg-blue-50 transition">
                                    <Play size={16} /> Start learning
                                </button>
                                {course.updatedAt && (
                                    <span className="text-xs text-blue-100 mx-auto">
                                        Updated: {new Date(course.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="lg:grid lg:grid-cols-[1fr_minmax(0,280px)] lg:gap-5 lg:items-start">
                            <div className="space-y-5">
                                <DescriptionSection description={course.description} />

                                <div className="space-y-4">
                                    {course.modules.map((mod, index) => {
                                        const moduleTestScore = moduleTestScores[mod.id]

                                        return (
                                            <ChapterCard
                                                key={mod.id}
                                                module={mod}
                                                index={index}
                                                testResults={moduleTestScore}
                                                onLessonSelect={setActiveLesson}
                                                onStartTest={() => handleStartModuleTest(mod.id, index)}
                                                onReviewTest={() => handleReviewModuleTest(mod.id, index)}
                                            />
                                        )
                                    })}

                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <div className="relative border-2 rounded-2xl bg-white overflow-hidden transition-all duration-200 border-[#0080ff]/30 hover:shadow-lg hover:-translate-y-1">
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#0080ff]/5 to-transparent pointer-events-none" />

                                            <div className="relative px-6 md:px-8 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                                <div className="flex items-start gap-5 flex-1">
                                                    <div
                                                        className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${finalCertification?.passed ? "bg-[#0080ff]/10" : "bg-[#0080ff]/5"
                                                            }`}
                                                    >
                                                        {finalCertification?.passed ? (
                                                            <Award size={40} className="text-[#0080ff]" />
                                                        ) : (
                                                            <Award size={40} className="text-[#0080ff]" />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Final Certification Exam</h2>
                                                        <p className="text-sm md:text-base text-gray-600 mt-2">
                                                            {finalCertification?.passed
                                                                ? "You have successfully earned your course certificate! 🎉"
                                                                : "Comprehensive exam to earn course certification"}
                                                        </p>
                                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                                            <span>20 Questions</span>
                                                            <span>60 Minutes</span>
                                                            <span>75% to Pass</span>
                                                        </div>
                                                        {finalCertification && (
                                                            <div className="mt-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium text-gray-700">Score:</span>
                                                                    <span
                                                                        className={`text-sm font-bold ${finalCertification.passed ? "text-[#0080ff]" : "text-[#0080ff]"}`}
                                                                    >
                                                                        {finalCertification.score.toFixed(1)}%
                                                                    </span>
                                                                    <span
                                                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${finalCertification.passed ? "bg-[#0080ff]/10 text-[#0080ff]" : "bg-[#0080ff]/10 text-[#0080ff]"}`}
                                                                    >
                                                                        {finalCertification.passed ? "Certified" : "Try Again"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-shrink-0">
                                                    {finalCertification?.passed ? (
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={handleReviewCertification}
                                                                className="inline-flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold px-6 py-3 hover:bg-gray-200 transition shadow-sm whitespace-nowrap"
                                                            >
                                                                Review Exam
                                                            </button>
                                                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0080ff]/10 border border-[#0080ff]/30 text-sm font-semibold text-[#0080ff]">
                                                                <Award size={18} />
                                                                Certified
                                                            </div>
                                                        </div>
                                                    ) : isDemoMode || course.modules.every((m) => (m.completionPercentage || 0) === 100) ? (
                                                        <button
                                                            onClick={handleStartCertification}
                                                            className="inline-flex items-center justify-center rounded-lg bg-[#0080ff] text-white text-sm font-semibold px-6 py-3 hover:bg-[#0080ff]/90 transition shadow-md whitespace-nowrap"
                                                        >
                                                            Start Final Exam
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="inline-flex items-center gap-2 justify-center rounded-lg bg-gray-100 text-gray-500 text-sm font-semibold px-6 py-3 opacity-60 cursor-not-allowed whitespace-nowrap"
                                                        >
                                                            <Clock size={18} />
                                                            Complete All Modules
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <aside className="space-y-5 lg:mt-0">
                                <div className="bg-white border border-gray-200/70 rounded-xl p-4 space-y-4">
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Share</h3>
                                        <div className="flex gap-2">
                                            <button
                                                className="w-14 h-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition"
                                                aria-label="Copy link"
                                                type="button"
                                            >
                                                <svg aria-hidden="true" height="20" width="20" viewBox="0 0 18 18" fill="currentColor">
                                                    <path d="m6.143 13.209 1.43 1.43a4.5 4.5 0 0 1-5.99-6.698L4.41 5.112a4.5 4.5 0 0 1 6.698 5.991l-1.43-1.43a2.5 2.5 0 0 0-3.854-3.146L2.997 9.355a2.5 2.5 0 0 0 3.146 3.854Zm5.728-8.415-1.43-1.43a4.5 4.5 0 0 1 5.99 6.698l-2.828 2.829A4.5 4.5 0 0 1 6.905 6.9l1.43 1.43a2.5 2.5 0 0 0 3.854 3.146l2.828-2.828a2.5 2.5 0 0 0-3.146-3.854Z" />
                                                </svg>
                                            </button>

                                            <button className="w-14 h-14 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white hover:bg-[#005f92] transition">
                                                <svg aria-hidden="true" height="20" width="20" viewBox="0 0 18 18" fill="currentColor">
                                                    <path d="M15.3 15.4h-2.7v-4.2c0-1 0-2.3-1.4-2.3S9.6 10 9.6 11.1v4.2H7V6.8h2.6V8c.5-.9 1.5-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7zM4 5.6c-.8 0-1.5-.7-1.5-1.5S3.2 2.5 4 2.5s1.5.7 1.5 1.5c.1.9-.6 1.6-1.5 1.6zm1.3 9.8H2.7V6.8h2.7v8.6zM16.7.1H1.3C.6 0 0 .6 0 1.4v15.4c0 .7.6 1.3 1.3 1.3h15.3c.7 0 1.3-.6 1.3-1.3V1.4C18 .6 17.4 0 16.7.1z" />
                                                </svg>
                                            </button>

                                            <button className="w-14 h-14 rounded-lg bg-[#1877F2] flex items-center justify-center text-white hover:bg-[#166fe5] transition">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                </svg>
                                            </button>

                                            <button className="w-14 h-14 rounded-lg bg-black flex items-center justify-center text-white hover:bg-[#1a1a1a] transition">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200/70 rounded-xl p-4 space-y-4">
                                    {course.prerequisites && course.prerequisites.length > 0 && (
                                        <div className="pt-2">
                                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                                <svg
                                                    className="w-3.5 h-3.5 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                Prerequisites
                                            </h3>

                                            <ul className="space-y-2">
                                                {course.prerequisites.map((req, i) => (
                                                    <li key={i} className="group">
                                                        <a
                                                            href="#"
                                                            className="flex items-start gap-2.5 text-xs font-semibold text-[#0080ff] hover:text-[#0080ff]/80 hover:underline group-hover:translate-x-1 transition-all duration-200"
                                                        >
                                                            <svg
                                                                className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0080ff] group-hover:scale-110 transition-transform"
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                            {req}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {course.instructor && (
                                    <div className="bg-white border border-gray-200/70 rounded-xl p-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Instructor</h3>
                                        <div className="flex items-center gap-3 mb-3">
                                            <img
                                                src={course.instructor.avatar || "/placeholder.svg"}
                                                alt={course.instructor.name}
                                                className="w-14 h-14 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900 ml-2">
                                                    {course.instructor.name}
                                                    <p className="text-xs text-gray-600 line-clamp-3 mb-2">{course.instructor.bio}</p>
                                                    <button className="text-xs font-semibold text-[#0080ff] hover:text-[#0080ff]/80">
                                                        View profile
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {course.collaborators && course.collaborators.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-gray-100">
                                                <h4 className="text-[11px] text-gray-500 font-semibold mb-2">Collaborators</h4>
                                                <div className="flex gap-2">
                                                    {course.collaborators.map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={img || "/placeholder.svg"}
                                                            className="w-7 h-7 rounded-full border border-white shadow-sm object-cover"
                                                            alt="Collaborator"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {course.relatedCourses && course.relatedCourses.length > 0 && (
                                    <div className="bg-white border border-gray-200/70 rounded-xl p-4">
                                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                                            Related courses
                                        </h3>
                                        <ul className="space-y-2">
                                            {course.relatedCourses.map((name, i) => (
                                                <li key={i} className="flex items-center gap-2 text-xs text-gray-800">
                                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <Zap size={12} className="text-[#0080ff]" />
                                                    </span>
                                                    <span className="hover:underline cursor-pointer">{name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="bg-gradient-to-br from-[#0080ff]/5 to-white border border-[#0080ff]/20 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-[#0080ff] uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <FileCheck2 size={14} />
                                        Assessment System
                                    </h3>
                                    <p className="text-xs text-gray-700 mb-3">Full-screen professional testing environment:</p>
                                    <ul className="space-y-2 text-xs text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <div className="w-4 h-4 rounded-full bg-[#0080ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-[#0080ff]">1</span>
                                            </div>
                                            <span>
                                                <strong>Timed Exams:</strong> Real-time countdown with auto-submit
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-4 h-4 rounded-full bg-[#0080ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-[#0080ff]">2</span>
                                            </div>
                                            <span>
                                                <strong>Question Flagging:</strong> Mark questions for review
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-4 h-4 rounded-full bg-[#0080ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-[#0080ff]">3</span>
                                            </div>
                                            <span>
                                                <strong>Detailed Review:</strong> Comprehensive results analysis
                                            </span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-4 h-4 rounded-full bg-[#0080ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-[10px] font-bold text-[#0080ff]">4</span>
                                            </div>
                                            <span>
                                                <strong>Progress Tracking:</strong> Track scores and improvement
                                            </span>
                                        </li>
                                    </ul>

                                    <div className="mt-4 pt-3 border-t border-[#0080ff]/10">
                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                            <span>Module Tests Completed</span>
                                            <span>{Object.keys(moduleTestScores).length}/3</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#0080ff] rounded-full transition-all duration-300"
                                                style={{ width: `${(Object.keys(moduleTestScores).length / 3) * 100}%` }}
                                            />
                                        </div>
                                        {finalCertification && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                Final Certification: {finalCertification.passed ? "Passed" : "In Progress"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </section>
                </div>
            </main>

            <TestLoadingState
                isLoading={isTestLoading}
                error={testError}
                onRetry={handleRetryTest}
                onCancel={handleTestClose}
                testType={pendingTest?.type || "module"}
                moduleIndex={pendingTest?.moduleIndex}
            />

            {activeLesson && (
                <LessonOverlay
                    block={activeLesson}
                    onClose={() => setActiveLesson(null)}
                    onComplete={handleLessonComplete}
                    onPrev={() => navigateLesson(-1)}
                    onNext={() => navigateLesson(1)}
                />
            )}

            {activeTest && !isTestLoading && (
                <FullScreenTest
                    config={activeTest.config}
                    questions={activeTest.questions}
                    onClose={handleTestClose}
                    onComplete={handleTestComplete}
                />
            )}
        </div>
    )
}

export default CoursePage