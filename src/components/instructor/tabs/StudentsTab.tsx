// components/instructor/tabs/StudentsTab.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Search, Users, Mail, Send, Calendar, Filter } from "lucide-react"

interface Student {
    id: string
    name: string
    email: string
    avatar?: string
    enrolledCourses: number
    completedCourses: number
    lastActivity: string
}

interface Enrollment {
    id: string
    studentId: string
    studentName: string
    studentEmail: string
    studentAvatar?: string
    courseId: string
    courseTitle: string
    progress: number
    lastActivity: string
    enrolledOn: string
}

const mockStudents: Student[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        avatar: "/avatar-1.jpg",
        enrolledCourses: 3,
        completedCourses: 1,
        lastActivity: "2023-11-15T14:30:00Z",
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        avatar: "/avatar-2.jpg",
        enrolledCourses: 2,
        completedCourses: 2,
        lastActivity: "2023-11-14T10:20:00Z",
    },
    {
        id: "3",
        name: "Bob Johnson",
        email: "bob@example.com",
        avatar: "/avatar-3.jpg",
        enrolledCourses: 5,
        completedCourses: 3,
        lastActivity: "2023-11-13T16:45:00Z",
    },
]
const mockEnrollments: Enrollment[] = [
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
    {
        id: "3",
        studentId: "3",
        studentName: "Bob Johnson",
        studentEmail: "bob@example.com",
        studentAvatar: "/avatar-3.jpg",
        courseId: "2",
        courseTitle: "Advanced TypeScript",
        progress: 45,
        lastActivity: "2023-11-13T16:45:00Z",
        enrolledOn: "2023-11-01T11:15:00Z",
    },
]


const mockCourses = [
    { id: "1", title: "React for Beginners" },
    { id: "2", title: "Advanced TypeScript" },
    { id: "3", title: "UI/UX Design Fundamentals" },
]

export const StudentsTab = () => {
    const [search, setSearch] = useState("")
    const [courseFilter, setCourseFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
    const [showProgressSheet, setShowProgressSheet] = useState(false)

    const filteredEnrollments = mockEnrollments
        .filter(enrollment => courseFilter === "all" || enrollment.courseId === courseFilter)
        .filter(enrollment => statusFilter === "all" ||
            (statusFilter === "active" && enrollment.progress < 100) ||
            (statusFilter === "completed" && enrollment.progress === 100)
        )
        .filter(enrollment =>
            enrollment.studentName.toLowerCase().includes(search.toLowerCase()) ||
            enrollment.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
            enrollment.courseTitle.toLowerCase().includes(search.toLowerCase())
        )

    const handleViewProgress = (enrollment: Enrollment) => {
        setSelectedEnrollment(enrollment)
        setShowProgressSheet(true)
    }

    const handleSendMessage = (studentId: string) => {
        // Simulate sending message
        console.log("Sending message to student:", studentId)
    }

    const handleSendReminder = (studentId: string) => {
        // Simulate sending reminder
        console.log("Sending reminder to student:", studentId)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Students & Enrollments</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search students..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
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
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Empty State */}
            {filteredEnrollments.length === 0 ? (
                <Card className="bg-white shadow-sm p-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <Users className="h-16 w-16 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                    </motion.div>
                </Card>
            ) : (
                <Card className="bg-white shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Last Activity</TableHead>
                                <TableHead>Enrolled On</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEnrollments.map((enrollment, index) => (
                                <motion.tr
                                    key={enrollment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar>
                                                <AvatarImage src={enrollment.studentAvatar} alt={enrollment.studentName} />
                                                <AvatarFallback>{enrollment.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{enrollment.studentName}</p>
                                                <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{enrollment.courseTitle}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Progress value={enrollment.progress} className="w-16" />
                                            <span className="text-sm">{enrollment.progress}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(enrollment.lastActivity).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(enrollment.enrolledOn).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewProgress(enrollment)}
                                        >
                                            View Progress
                                        </Button>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}

            {/* Progress Sheet */}
            {selectedEnrollment && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowProgressSheet(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={selectedEnrollment.studentAvatar} alt={selectedEnrollment.studentName} />
                                <AvatarFallback>{selectedEnrollment.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-medium">{selectedEnrollment.studentName}</h3>
                                <p className="text-sm text-gray-500">{selectedEnrollment.studentEmail}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Course</span>
                                <span className="text-sm">{selectedEnrollment.courseTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm">{selectedEnrollment.progress}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Enrolled On</span>
                                <span className="text-sm">{new Date(selectedEnrollment.enrolledOn).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Last Activity</span>
                                <span className="text-sm">{new Date(selectedEnrollment.lastActivity).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Progress Overview</h4>
                            <Progress value={selectedEnrollment.progress} className="w-full" />
                            <p className="text-sm text-gray-500">
                                {selectedEnrollment.progress === 100
                                    ? "Completed"
                                    : `${selectedEnrollment.progress}% complete`
                                }
                            </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Button variant="outline" className="w-full" onClick={() => handleSendReminder(selectedEnrollment.studentId)}>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Reminder
                            </Button>
                            <Button className="w-full bg-[#0080ff] hover:bg-[#0066cc]" onClick={() => handleSendMessage(selectedEnrollment.studentId)}>
                                <Send className="w-4 h-4 mr-2" />
                                Message Student
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}