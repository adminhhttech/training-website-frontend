// components/instructor/tabs/AnalyticsTab.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, DollarSign, Users, Clock, BarChart3 } from "lucide-react"

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

const completionRateData = [
    { name: "Completed", value: 65, color: "#0080ff" },
    { name: "In Progress", value: 25, color: "#8884d8" },
    { name: "Not Started", value: 10, color: "#82ca9d" },
]

const funnelData = [
    { name: "Enrolled", value: 324 },
    { name: "Started", value: 287 },
    { name: "50% Complete", value: 198 },
    { name: "Completed", value: 220 },
]

const topCoursesData = [
    { name: "React for Beginners", revenue: 48955, completionRate: 4.7 },
    { name: "Advanced TypeScript", revenue: 29988, completionRate: 4.8 },
    { name: "UI/UX Design", revenue: 15678, completionRate: 4.5 },
    { name: "Python Mastery", revenue: 22450, completionRate: 4.2 },
]

const recentEnrollmentsData = [
    { studentName: "John Doe", courseTitle: "React for Beginners", date: "2023-11-15" },
    { studentName: "Jane Smith", courseTitle: "Advanced TypeScript", date: "2023-11-14" },
    { studentName: "Bob Johnson", courseTitle: "UI/UX Design", date: "2023-11-13" },
    { studentName: "Alice Brown", courseTitle: "Python Mastery", date: "2023-11-12" },
]

export const AnalyticsTab = () => {
    const [timeRange, setTimeRange] = useState("6months")
    const [courseFilter, setCourseFilter] = useState("all")

    const mockCourses = [
        { id: "1", title: "React for Beginners" },
        { id: "2", title: "Advanced TypeScript" },
        { id: "3", title: "UI/UX Design" },
        { id: "4", title: "Python Mastery" },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="3months">Last 3 Months</SelectItem>
                            <SelectItem value="6months">Last 6 Months</SelectItem>
                            <SelectItem value="1year">Last Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={courseFilter} onValueChange={setCourseFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {mockCourses.map((course) => (
                                <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">$12,450</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-[#0080ff]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Enrollments</p>
                                    <p className="text-2xl font-bold text-gray-900">324</p>
                                </div>
                                <Users className="h-8 w-8 text-[#0080ff]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Avg Watch-time</p>
                                    <p className="text-2xl font-bold text-gray-900">4.2 hrs</p>
                                </div>
                                <Clock className="h-8 w-8 text-[#0080ff]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                    <p className="text-2xl font-bold text-gray-900">68%</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-[#0080ff]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
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
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Enrollments Over Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={enrollmentData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="enrollments" fill="#0080ff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Funnel and Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Completion Funnel</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={funnelData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#0080ff" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Completion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={completionRateData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {completionRateData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Top Courses by Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {topCoursesData.map((course, index) => (
                                    <motion.div
                                        key={course.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex justify-between items-center p-2 rounded hover:bg-gray-50"
                                    >
                                        <span className="font-medium">{course.name}</span>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">${course.revenue.toLocaleString()}</div>
                                            <div className="text-xs text-gray-400">{course.completionRate}★</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Enrollments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {recentEnrollmentsData.map((enrollment, index) => (
                                    <motion.div
                                        key={enrollment.studentName}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="flex justify-between items-center p-2 rounded hover:bg-gray-50"
                                    >
                                        <div>
                                            <div className="font-medium">{enrollment.studentName}</div>
                                            <div className="text-xs text-gray-500">{enrollment.courseTitle}</div>
                                        </div>
                                        <div className="text-sm text-gray-600">{new Date(enrollment.date).toLocaleDateString()}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}