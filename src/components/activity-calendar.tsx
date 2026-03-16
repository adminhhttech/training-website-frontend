"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ActivityCalendar as ReactActivityCalendar, type ThemeInput } from "react-activity-calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Calendar,
    Flame,
    Target,
    TrendingUp,
    X,
    Loader2,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    CheckCircle,
} from "lucide-react"
import { Tooltip as ReactTooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import api, { type ActivityData } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"

interface ActivityCalendarProps {
    isOpen: boolean
    onClose: () => void
}

export function ActivityCalendar({ isOpen, onClose }: ActivityCalendarProps) {
    const { user, isInitialized } = useAuth()
    const userId = user?.id || ""

    const [activityData, setActivityData] = useState<ActivityData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const loadActivityData = useCallback(async () => {
        if (!userId) {
            setActivityData([])
            return
        }

        setIsLoading(true)
        try {
            const data = await api.getActivityData(userId, selectedYear)
            setActivityData(data)
        } catch (error) {
            console.error("Failed to load activity data:", error)
            setActivityData([])
        } finally {
            setIsLoading(false)
        }
    }, [userId, selectedYear])

    useEffect(() => {
        if (isOpen && isInitialized && userId) {
            loadActivityData()
        }
    }, [isOpen, isInitialized, userId, loadActivityData])

    const calendarData = useMemo(() => {
        // Create a map of existing activity data
        const activityMap = new Map<string, ActivityData>()
        activityData.forEach((a) => activityMap.set(a.date, a))

        // Generate all dates for the selected year
        const startDate = new Date(selectedYear, 0, 1)
        const endDate = new Date(selectedYear, 11, 31)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const dates: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = []

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toLocaleDateString("en-CA")
            const activity = activityMap.get(dateStr)
            const isFuture = d > today

            let level: 0 | 1 | 2 | 3 | 4 = 0
            let count = 0

            if (!isFuture && activity) {
                count = activity.questionsAttempted
                if (count > 0) {
                    if (count <= 5) level = 1
                    else if (count <= 15) level = 2
                    else if (count <= 30) level = 3
                    else level = 4
                }
            }

            dates.push({ date: dateStr, count, level })
        }

        return dates
    }, [activityData, selectedYear])

    const customTheme: ThemeInput = {
        light: ["#ebedf0", "#b3d9ff", "#66b3ff", "#339cff", "#00a7ff"],
        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    }

    const stats = useMemo(() => {
        const totalQuestions = activityData.reduce((sum, a) => sum + a.questionsAttempted, 0)
        const totalCorrect = activityData.reduce((sum, a) => sum + a.correctAnswers, 0)
        const totalTests = activityData.reduce((sum, a) => sum + a.testsCompleted, 0)
        const activeDays = activityData.filter((a) => a.questionsAttempted > 0).length
        const allTopics = [...new Set(activityData.flatMap((a) => a.topics))]

        let streak = 0
        const today = new Date()
        const sortedDates = activityData
            .filter((a) => a.questionsAttempted > 0)
            .map((a) => a.date)
            .sort()
            .reverse()

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today)
            checkDate.setDate(checkDate.getDate() - i)
            const checkStr = checkDate.toISOString().split("T")[0]

            if (sortedDates.includes(checkStr)) {
                streak++
            } else if (i > 0) {
                break
            }
        }

        return { totalQuestions, totalCorrect, totalTests, activeDays, streak, allTopics }
    }, [activityData])

    const activityMap = useMemo(() => {
        const map = new Map<string, ActivityData>()
        activityData.forEach((a) => map.set(a.date, a))
        return map
    }, [activityData])

    const currentYear = new Date().getFullYear()

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
                <Card className="rounded-2xl shadow-sm border">
                    <CardHeader className="px-4 pt-4 pb-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">

                                <div>
                                    <CardTitle className="!text-lg text-[#375A7E]">Practice Activity</CardTitle>
                                    <CardDescription className="text-[#375A7E]">
                                        {stats.totalQuestions} questions attempted in {selectedYear}
                                    </CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedYear((y) => y - 1)}
                                        className="h-8 w-8 text-[#375A7E] hover:text-[#00a7ff] hover:bg-[#00a7ff]/10"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="px-3 text-sm font-semibold text-[#375A7E] min-w-[60px] text-center">
                                        {selectedYear}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedYear((y) => Math.min(y + 1, currentYear))}
                                        disabled={selectedYear >= currentYear}
                                        className="h-8 w-8 text-[#375A7E] hover:text-[#00a7ff] hover:bg-[#00a7ff]/10 disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="h-9 w-9 text-[#375A7E] hover:text-[#00a7ff] hover:bg-[#00a7ff]/10"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                        {!isInitialized ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-[#00a7ff]" />
                                <span className="ml-3 text-[#375A7E]">Initializing...</span>
                            </div>
                        ) : !userId ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Calendar className="h-12 w-12 text-[#375A7E] mb-4" />
                                <p className="text-[#375A7E] text-lg font-medium">Please sign in to view your activity</p>
                                <p className="text-[#375A7E] text-sm mt-1">Your practice progress will be tracked automatically</p>
                            </div>
                        ) : isLoading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-[#00a7ff]" />
                                <span className="ml-3 text-[#375A7E]">Loading activity data...</span>
                            </div>
                        ) : (
                            <>
                                {/* Stats Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 text-[#375A7E] mb-2">
                                            <Flame className="h-4 w-4 text-orange-500" />
                                            <span className="text-xs font-medium uppercase tracking-wide">Current Streak</span>
                                        </div>
                                        <p className="text-2xl font-bold text-[#375A7E]">{stats.streak}</p>
                                        <p className="text-xs text-[#375A7E] mt-1">days</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 text-[#375A7E] mb-2">
                                            <BookOpen className="h-4 w-4 text-[#00a7ff]" />
                                            <span className="text-xs font-medium uppercase tracking-wide">Tests Done</span>
                                        </div>
                                        <p className="text-2xl font-bold text-[#375A7E]">{stats.totalTests}</p>
                                        <p className="text-xs text-[#375A7E] mt-1">completed</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 text-[#375A7E] mb-2">
                                            <Target className="h-4 w-4 text-[#00a7ff]" />
                                            <span className="text-xs font-medium uppercase tracking-wide">Questions</span>
                                        </div>
                                        <p className="text-2xl font-bold text-[#375A7E]">{stats.totalQuestions}</p>
                                        <p className="text-xs text-[#375A7E] mt-1">attempted</p>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 text-[#375A7E] mb-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-xs font-medium uppercase tracking-wide">Correct</span>
                                        </div>
                                        <p className="text-2xl font-bold text-[#375A7E]">{stats.totalCorrect}</p>
                                        <p className="text-xs text-[#375A7E] mt-1">
                                            {stats.totalQuestions > 0
                                                ? `${Math.round((stats.totalCorrect / stats.totalQuestions) * 100)}%`
                                                : "0%"}{" "}
                                            accuracy
                                        </p>
                                    </div>
                                </div>

                                {/* Topics Practiced */}
                                {stats.allTopics.length > 0 && (
                                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-2 text-[#375A7E] mb-3">
                                            <TrendingUp className="h-4 w-4 text-[#00a7ff]" />
                                            <span className="text-xs font-medium uppercase tracking-wide">Topics Practiced</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {stats.allTopics.map((topic, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="secondary"
                                                    className="bg-[#00a7ff]/10 text-[#00a7ff] hover:bg-[#00a7ff]/20"
                                                >
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Calendar Grid - Using react-activity-calendar library */}
                                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm overflow-x-auto">
                                    <ReactActivityCalendar
                                        data={calendarData}
                                        theme={customTheme}
                                        colorScheme="light"
                                        blockSize={12}
                                        blockMargin={4}
                                        blockRadius={2}
                                        fontSize={12}
                                        showWeekdayLabels
                                        labels={{
                                            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                            weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                                            totalCount: `${stats.totalQuestions} questions in ${selectedYear}`,
                                            legend: {
                                                less: "Less",
                                                more: "More",
                                            },
                                        }}
                                        renderBlock={(block, activity) => {
                                            const actData = activityMap.get(activity.date)
                                            const dateFormatted = new Date(activity.date + "T12:00:00").toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            return (
                                                <rect
                                                    {...block.props}
                                                    data-tooltip-id="activity-tooltip"
                                                    data-tooltip-html={
                                                        actData && actData.questionsAttempted > 0
                                                            ? `<div style="text-align: left;">
                                  <div style="font-weight: 700; margin-bottom: 6px;">${dateFormatted}</div>
                                  <div style="margin-bottom: 2px;">${actData.testsCompleted} test${actData.testsCompleted !== 1 ? 's' : ''} completed</div>
                                  <div style="margin-bottom: 2px;">${actData.questionsAttempted} questions attempted</div>
                                  <div style="margin-bottom: 4px;">${actData.correctAnswers} correct answers</div>
                                  ${actData.topics && actData.topics.length > 0
                                                                ? `<div style="font-weight: 600; color: #00a7ff;">Topics: ${actData.topics.join(", ")}</div>`
                                                                : ''}
                                </div>`
                                                            : `<div style="text-align: left;">
                                  <div style="font-weight: 700; margin-bottom: 4px;">${dateFormatted}</div>
                                  <div style="color: #9ca3af;">No activity</div>
                                </div>`
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                    <ReactTooltip
                                        id="activity-tooltip"
                                        place="top"
                                        className="!bg-slate-900 !text-white !text-sm !rounded-xl !px-4 !py-3 !shadow-2xl !opacity-100 !max-w-xs"
                                        style={{ zIndex: 9999, backgroundColor: "#1e293b" }}
                                        noArrow={false}
                                    />
                                </div>

                                {/* Legend */}
                                <div className="flex items-center justify-end text-xs text-[#375A7E]">
                                    <span className="text-[#375A7E]">{user?.name ? `${user.name}'s activity` : "Your activity"}</span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// Dashboard inline version - not a modal, embedded directly
export function DashboardActivityCalendar() {
    const { user, isInitialized } = useAuth()
    const userId = user?.id || ""

    const [activityData, setActivityData] = useState<ActivityData[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const loadActivityData = useCallback(async () => {
        if (!userId) {
            setActivityData([])
            return
        }

        setIsLoading(true)
        try {
            const data = await api.getActivityData(userId, selectedYear)
            setActivityData(data)
        } catch (error) {
            console.error("Failed to load activity data:", error)
            setActivityData([])
        } finally {
            setIsLoading(false)
        }
    }, [userId, selectedYear])

    useEffect(() => {
        if (isInitialized && userId) {
            loadActivityData()
        }
    }, [isInitialized, userId, loadActivityData])

    const calendarData = useMemo(() => {
        const activityMap = new Map<string, ActivityData>()
        activityData.forEach((a) => activityMap.set(a.date, a))

        const startDate = new Date(selectedYear, 0, 1)
        const endDate = new Date(selectedYear, 11, 31)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const dates: Array<{ date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }> = []

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toLocaleDateString("en-CA")
            const activity = activityMap.get(dateStr)
            const isFuture = d > today

            let level: 0 | 1 | 2 | 3 | 4 = 0
            let count = 0

            if (!isFuture && activity) {
                count = activity.questionsAttempted
                if (count > 0) {
                    if (count <= 5) level = 1
                    else if (count <= 15) level = 2
                    else if (count <= 30) level = 3
                    else level = 4
                }
            }

            dates.push({ date: dateStr, count, level })
        }

        return dates
    }, [activityData, selectedYear])

    const customTheme: ThemeInput = {
        light: ["#ebedf0", "#b3d9ff", "#66b3ff", "#339cff", "#00a7ff"],
        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    }

    const stats = useMemo(() => {
        const totalQuestions = activityData.reduce((sum, a) => sum + a.questionsAttempted, 0)
        const totalCorrect = activityData.reduce((sum, a) => sum + a.correctAnswers, 0)
        const totalTests = activityData.reduce((sum, a) => sum + a.testsCompleted, 0)

        let streak = 0
        const today = new Date()
        const sortedDates = activityData
            .filter((a) => a.questionsAttempted > 0)
            .map((a) => a.date)
            .sort()
            .reverse()

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today)
            checkDate.setDate(checkDate.getDate() - i)
            const checkStr = checkDate.toISOString().split("T")[0]

            if (sortedDates.includes(checkStr)) {
                streak++
            } else if (i > 0) {
                break
            }
        }

        return { totalQuestions, totalCorrect, totalTests, streak }
    }, [activityData])

    const activityMap = useMemo(() => {
        const map = new Map<string, ActivityData>()
        activityData.forEach((a) => map.set(a.date, a))
        return map
    }, [activityData])

    const currentYear = new Date().getFullYear()

    return (
        <Card className="rounded-2xl shadow-sm border">
            <CardHeader className="px-4 pt-4 pb-2">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="!text-lg text-[#375A7E] font-semibold">Practice Activity</span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedYear((y) => y - 1)}
                            className="h-7 w-7 text-[#375A7E] hover:text-[#00a7ff] hover:bg-[#00a7ff]/10"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-2 text-sm font-semibold text-[#375A7E] min-w-[50px] text-center">
                            {selectedYear}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedYear((y) => Math.min(y + 1, currentYear))}
                            disabled={selectedYear >= currentYear}
                            className="h-7 w-7 text-[#375A7E] hover:text-[#00a7ff] hover:bg-[#00a7ff]/10 disabled:opacity-50"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-[#375A7E]">
                    {stats.totalQuestions} questions attempted in {selectedYear}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-3 sm:p-4 lg:p-6">
                {!isInitialized ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#00a7ff]" />
                        <span className="ml-2 text-[#375A7E] text-sm">Initializing...</span>
                    </div>
                ) : !userId ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Calendar className="h-10 w-10 text-[#375A7E] mb-3" />
                        <p className="text-[#375A7E] text-sm font-medium">Please sign in to view your activity</p>
                    </div>
                ) : isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#00a7ff]" />
                        <span className="ml-2 text-[#375A7E] text-sm">Loading activity...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            <div className="bg-[#eaf6ff] rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-[#375A7E] mb-1">
                                    <img src="/ac1.png" alt="streak" className="h-3.5 w-3.5" />
                                    <span className="text-[10px] sm:text-xs font-medium uppercase">Streak</span>
                                </div>
                                <p className="text-lg sm:text-xl font-bold text-[#375A7E]">{stats.streak}</p>
                            </div>
                            <div className="bg-[#eaf6ff] rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-[#375A7E] mb-1">
                                    <img src="/ac2.png" alt="tests" className="h-3.5 w-3.5" />
                                    <span className="text-[10px] sm:text-xs font-medium uppercase">Tests</span>
                                </div>
                                <p className="text-lg sm:text-xl font-bold text-[#375A7E]">{stats.totalTests}</p>
                            </div>
                            <div className="bg-[#eaf6ff] rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-[#375A7E] mb-1">
                                    <img src="/ac3.png" alt="questions" className="h-3.5 w-3.5" />
                                    <span className="text-[10px] sm:text-xs font-medium uppercase">Questions</span>
                                </div>
                                <p className="text-lg sm:text-xl font-bold text-[#375A7E]">{stats.totalQuestions}</p>
                            </div>
                            <div className="bg-[#eaf6ff] rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-[#375A7E] mb-1">
                                    <img src="/ac4.png" alt="correct" className="h-3.5 w-3.5" />
                                    <span className="text-[10px] sm:text-xs font-medium uppercase">Correct</span>
                                </div>
                                <p className="text-lg sm:text-xl font-bold text-[#375A7E]">{stats.totalCorrect}</p>
                            </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="bg-white rounded-xl p-3 border border-[#e6f0ff] overflow-x-auto">
                            <ReactActivityCalendar
                                data={calendarData}
                                theme={customTheme}
                                colorScheme="light"
                                blockSize={10}
                                blockMargin={3}
                                blockRadius={2}
                                fontSize={10}
                                showWeekdayLabels
                                labels={{
                                    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                                    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                                    totalCount: `${stats.totalQuestions} questions in ${selectedYear}`,
                                    legend: {
                                        less: "Less",
                                        more: "More",
                                    },
                                }}
                                renderBlock={(block, activity) => {
                                    const actData = activityMap.get(activity.date)
                                    const dateFormatted = new Date(activity.date + "T12:00:00").toLocaleDateString("en-US", {
                                        weekday: "short",
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })
                                    return (
                                        <rect
                                            {...block.props}
                                            data-tooltip-id="dashboard-activity-tooltip"
                                            data-tooltip-html={
                                                actData && actData.questionsAttempted > 0
                                                    ? `<div style="text-align: left;">
                                  <div style="font-weight: 700; margin-bottom: 6px;">${dateFormatted}</div>
                                  <div style="margin-bottom: 2px;">${actData.testsCompleted} test${actData.testsCompleted !== 1 ? 's' : ''} completed</div>
                                  <div style="margin-bottom: 2px;">${actData.questionsAttempted} questions attempted</div>
                                  <div style="margin-bottom: 4px;">${actData.correctAnswers} correct answers</div>
                                  ${actData.topics && actData.topics.length > 0
                                                        ? `<div style="font-weight: 600; color: #00a7ff;">Topics: ${actData.topics.join(", ")}</div>`
                                                        : ''}
                                </div>`
                                                    : `<div style="text-align: left;">
                                  <div style="font-weight: 700; margin-bottom: 4px;">${dateFormatted}</div>
                                  <div style="color: #9ca3af;">No activity</div>
                                </div>`
                                            }
                                        />
                                    )
                                }}
                            />
                            <ReactTooltip
                                id="dashboard-activity-tooltip"
                                place="top"
                                className="!bg-slate-900 !text-white !text-xs !rounded-lg !px-3 !py-2 !shadow-xl !opacity-100 !max-w-xs"
                                style={{ zIndex: 9999, backgroundColor: "#1e293b" }}
                                noArrow={false}
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
