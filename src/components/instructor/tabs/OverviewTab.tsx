// components/instructor/tabs/OverviewTab.tsx
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp, Award, Users, DollarSign, BookOpen, Star, BarChart3, MessageSquare, HelpCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useAuth } from "@/contexts/AuthContext"

interface UserData {
    name: string
    // Add other fields as needed, e.g. email?: string
}

interface OverviewTabProps {
    greeting: string
    userData: UserData
    setActiveTab: (tab: string) => void
}

// Mock data for charts
const enrollmentData = [
    { month: "Jan", enrollments: 120 },
    { month: "Feb", enrollments: 150 },
    { month: "Mar", enrollments: 180 },
    { month: "Apr", enrollments: 210 },
    { month: "May", enrollments: 240 },
    { month: "Jun", enrollments: 280 },
]

const revenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 21000 },
    { month: "May", revenue: 24000 },
    { month: "Jun", revenue: 28000 },
]

// Mock data for activity feed
const mockEnrollments = [
    {
        id: "1",
        studentId: "1",
        studentName: "John Doe",
        studentEmail: "john@example.com",
        studentAvatar: "/avatar-1.jpg",
        courseId: "1",
        courseTitle: "React for Beginners",
        progress: 75,
        lastActivity: "2023-11-15T14:30:00Z",
        enrolledOn: "2023-10-15T09:00:00Z",
    },
    {
        id: "2",
        studentId: "2",
        studentName: "Jane Smith",
        studentEmail: "jane@example.com",
        studentAvatar: "/avatar-2.jpg",
        courseId: "1",
        courseTitle: "React for Beginners",
        progress: 100,
        lastActivity: "2023-11-14T10:20:00Z",
        enrolledOn: "2023-10-10T14:30:00Z",
    },
]

const mockReviews = [
    {
        id: "1",
        studentName: "John Doe",
        studentAvatar: "/avatar-1.jpg",
        courseId: "1",
        courseTitle: "React for Beginners",
        rating: 5,
        comment: "Excellent course! Very clear explanations and practical examples.",
        date: "2023-11-14T10:30:00Z",
    },
    {
        id: "2",
        studentName: "Jane Smith",
        studentAvatar: "/avatar-2.jpg",
        courseId: "1",
        courseTitle: "React for Beginners",
        rating: 4,
        comment: "Good content, but would like more advanced topics.",
        date: "2023-11-13T15:20:00Z",
    },
]

const mockQuestions = [
    {
        id: "1",
        studentName: "John Doe",
        studentAvatar: "/avatar-1.jpg",
        courseId: "1",
        courseTitle: "React for Beginners",
        question: "How do I handle state in complex applications?",
        date: "2023-11-15T14:30:00Z",
        isResolved: false,
        isPinned: false,
    },
    {
        id: "2",
        studentName: "Jane Smith",
        studentAvatar: "/avatar-2.jpg",
        courseId: "1",
        courseTitle: "React for Beginners",
        question: "Can you explain useEffect in more detail?",
        date: "2023-11-14T10:20:00Z",
        isResolved: true,
        isPinned: true,
    },
]

export const OverviewTab = ({ greeting, userData, setActiveTab }: OverviewTabProps) => {
    // Calculate KPIs
    const totalStudents = 245
    const activeCourses = 3
    const thisMonthRevenue = 12450.50
    const avgCompletionRate = 68

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
                    <p className="text-gray-600">{greeting}, {userData?.name?.split(" ")[0]}!</p>
                </div>
                <Button
                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                    onClick={() => setActiveTab("create")}
                >
                    Create New Course
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                            </div>
                            <Users className="h-8 w-8 text-[#0080ff]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                                <p className="text-2xl font-bold text-gray-900">{activeCourses}</p>
                            </div>
                            <BookOpen className="h-8 w-8 text-[#0080ff]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">This Month's Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">${thisMonthRevenue.toFixed(2)}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-[#0080ff]" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
                                <p className="text-2xl font-bold text-gray-900">{avgCompletionRate}%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-[#0080ff]" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Enrollments Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={enrollmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="enrollments" stroke="#0080ff" fill="#0080ff" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#0080ff" fill="#0080ff" fillOpacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Feed */}
            <Card className="bg-white shadow-sm">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {mockEnrollments.slice(0, 5).map((enrollment) => (
                            <div key={enrollment.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                <Avatar>
                                    <AvatarImage src={enrollment.studentAvatar} alt={enrollment.studentName} />
                                    <AvatarFallback>{enrollment.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{enrollment.studentName} enrolled in {enrollment.courseTitle}</p>
                                    <p className="text-xs text-gray-500">{new Date(enrollment.enrolledOn).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                        {mockReviews.slice(0, 3).map((review) => (
                            <div key={review.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                <Avatar>
                                    <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                                    <AvatarFallback>{review.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{review.studentName} reviewed {review.courseTitle}</p>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {mockQuestions.slice(0, 2).map((question) => (
                            <div key={question.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                <Avatar>
                                    <AvatarImage src={question.studentAvatar} alt={question.studentName} />
                                    <AvatarFallback>{question.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{question.studentName} asked a question in {question.courseTitle}</p>
                                    <p className="text-xs text-gray-500">{new Date(question.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}