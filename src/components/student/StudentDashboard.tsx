'use client';

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs"
import { Clock, TrendingUp, Award, CheckCircle, ArrowLeft } from "lucide-react"
import { courses } from "@/pages/courseSection"
import { useAuth } from "@/contexts/AuthContext"

import { PracticeSection } from "../practice-section"
import { DiscussionForum } from "../discussion-forum"
import { DashboardActivityCalendar } from "../activity-calendar"

import { DashboardLayout } from "./DashboardLayout"
import { DashboardHeader } from "./DashboardHeader"
import { ContinueLearning } from "./ContinueLearning"
import { Achievements } from "./Achievements"
import { RecommendedCourses } from "./RecommendedCourses"
import {

    Achievement,
    LearningStat
} from "./types"
import { DashboardMiddle } from "./DashboardMiddle";

// Mock achievements
const achievements: Achievement[] = [
    {
        id: 1,
        title: "First Course Completed",
        description: "Completed your first course",
        earned: true,
    },
    {
        id: 2,
        title: "Quick Learner",
        description: "Complete a course in under 30 days",
        earned: true,
    },
    {
        id: 4,
        title: "Course Collector",
        description: "Complete 10 courses",
        earned: false,
    },
    {
        id: 5,
        title: "Early Bird",
        description: "Complete 5 morning sessions",
        earned: true,
    },
    {
        id: 6,
        title: "Social Learner",
        description: "Join 5 study groups",
        earned: false,
    },
]

// Mock learning stats
const learningStats: LearningStat[] = [
    { label: "Learning Hours", value: "45", icon: Clock, color: "text-[#0080ff]" },
    { label: "Courses Completed", value: "3", icon: CheckCircle, color: "text-[#0080ff]" },
    { label: "Certificates Earned", value: "3", icon: Award, color: "text-[#0080ff]" },
    { label: "Current Streak", value: "7 days", icon: TrendingUp, color: "text-[#0080ff]" },
]

export const StudentDashboard = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user, isInitialized, logout } = useAuth()
    const [activeTab, setActiveTab] = useState("overview")
    const [greeting, setGreeting] = useState("")
    const [search, setSearch] = useState("")
    const [activeMenuItem, setActiveMenuItem] = useState("home")
    const [showPracticeSection, setShowPracticeSection] = useState(false)
    const [showForum, setShowForum] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check for navigation state from resume builder
    useEffect(() => {
        if (location.state?.openComponent) {
            const component = location.state.openComponent;

            if (component === "forum") {
                setActiveMenuItem("forum");
                setShowForum(true);
                setShowPracticeSection(false);
            } else if (component === "mock-test") {
                setActiveMenuItem("mock-test");
                setShowPracticeSection(true);
                setShowForum(false);
            }

            // Clear the navigation state to prevent reopening on refresh
            globalThis.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Good morning")
        else if (hour < 18) setGreeting("Good afternoon")
        else setGreeting("Good evening")
    }, [])

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (isInitialized && !user) {
            navigate("/login")
        }
    }, [user, isInitialized, navigate])

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const handleCourseClick = (courseId: number) => {
        navigate(`/course/${courseId}`)
    }

    const handleResumeCourseClick = () => {
        navigate(`/coursepage`)
    }

    const handleMenuItemChange = (itemId: string) => {
        setActiveMenuItem(itemId)
        if (itemId === "forum") {
            setShowForum(true)
            setShowPracticeSection(false)
        } else if (itemId === "mock-test") {
            setShowPracticeSection(true)
            setShowForum(false)
        } else if (itemId === "resume-lab") {
            navigate("/resume-builder")
        } else if (itemId === "mentor") {
            navigate("/mentor")

        } else {
            setShowForum(false)
            setShowPracticeSection(false)
        }
    }

    // Get courses data
    const enrolledCourses = courses.slice(11, 12)
    const inProgressCourses = enrolledCourses.filter((c) => c.progress < 100)
    const completedCourses = enrolledCourses.filter((c) => c.progress === 100)
    const recommendedCourses = courses.slice(16, 22)
    const currentCourse = inProgressCourses.length > 0 ? inProgressCourses[0] : null

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0080ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[#375A7E]">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-white">
            <Navbar search={search} setSearch={setSearch} />

            <DashboardLayout
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={handleMenuItemChange}
                handleLogout={handleLogout}
            >
                {/* Add bottom padding for mobile to prevent overlap with bottom dock */}
                <main className="px-4 sm:px-4 lg:px-2 pt-2 sm:pt-4 lg:pt-8 pb-[84px] md:pb-0">
                    {showForum && (
                        <div className="mt-4 sm:mt-6">
                            <Button
                                onClick={() => {
                                    setShowForum(false)
                                    setActiveMenuItem("home")
                                }}
                                variant="ghost"
                                className="mb-4"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                            </Button>
                            <DiscussionForum />
                        </div>
                    )}

                    {showPracticeSection && (
                        <div className="mt-4 sm:mt-6">
                            <Button
                                onClick={() => {
                                    setShowPracticeSection(false)
                                    setActiveMenuItem("home")
                                }}
                                variant="ghost"
                                className="mb-4"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                            </Button>
                            <PracticeSection />
                        </div>
                    )}

                    {!showForum && !showPracticeSection && (
                        <>
                            {/* Mobile Layout */}
                            <div className="lg:hidden space-y-4 sm:space-y-4">

                                <DashboardHeader
                                    userName={user.name || "Student"}

                                    learningStats={learningStats}
                                />

                                {currentCourse && (
                                    <ContinueLearning
                                        currentCourse={currentCourse}
                                        onResumeClick={handleResumeCourseClick}
                                    />
                                )}

                                {/* DASHBOARD MIDDLE - MOBILE */}
                                <div className="mt-4">
                                    <DashboardMiddle />
                                </div>

                                <Achievements
                                    achievements={achievements}
                                    limit={3}
                                />

                                <div className="mt-4">
                                    <DashboardActivityCalendar />
                                </div>

                                <div className="mt-4">
                                    <RecommendedCourses
                                        courses={recommendedCourses}
                                        onCourseClick={handleCourseClick}
                                    />
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden lg:block">
                                <div className="grid xl:grid-cols-12 gap-4">

                                    {/* LEFT COLUMN */}
                                    <div className="xl:col-span-3 space-y-4 lg:space-y-4">
                                        <DashboardHeader
                                            userName={user.name || "Student"}
                                            learningStats={learningStats}
                                        />

                                        <Achievements achievements={achievements} limit={3} />
                                    </div>

                                    {/* MIDDLE COLUMN */}
                                    <div className="xl:col-span-3 space-y-4 lg:space-y-4">
                                        <DashboardMiddle />

                                        <RecommendedCourses
                                            courses={recommendedCourses}
                                            onCourseClick={handleCourseClick}
                                        />
                                    </div>

                                    {/* RIGHT COLUMN */}
                                    <div className="xl:col-span-6 space-y-4 lg:space-y-4">
                                        {currentCourse && (
                                            <ContinueLearning
                                                currentCourse={currentCourse}
                                                onResumeClick={handleResumeCourseClick}
                                            />
                                        )}

                                        <DashboardActivityCalendar />
                                    </div>
                                </div>
                            </div>

                            {/* Tabs (hidden list, just for state) */}
                            <div className="mt-6 sm:mt-8 lg:mt-10">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="hidden" />
                                    <TabsContent value="overview" />
                                    <TabsContent value="my-courses" />
                                    <TabsContent value="achievements" />
                                    <TabsContent value="recommendations" />
                                </Tabs>
                            </div>
                        </>
                    )}
                </main>
            </DashboardLayout>
        </div>
    )
}