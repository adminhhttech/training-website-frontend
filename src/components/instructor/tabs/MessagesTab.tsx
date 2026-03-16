// components/instructor/tabs/MessagesTab.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Added missing import
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Plus, Calendar, Search, Star, Filter } from "lucide-react"

interface Message {
    id: string
    senderId: string
    senderName: string
    senderAvatar?: string
    recipientId: string
    recipientName: string
    subject: string
    content: string
    timestamp: string
    isRead: boolean
}

interface Announcement {
    id: string
    courseId?: string
    courseTitle?: string
    title: string
    content: string
    timestamp: string
    isScheduled: boolean
    scheduledFor?: string
}

const mockMessages: Message[] = [
    {
        id: "1",
        senderId: "1",
        senderName: "John Doe",
        senderAvatar: "/avatar-1.jpg",
        recipientId: "instructor",
        recipientName: "Instructor",
        subject: "Question about React course",
        content: "I'm having trouble with the state management section. Can you provide additional resources?",
        timestamp: "2023-11-15T14:30:00Z",
        isRead: false,
    },
    {
        id: "2",
        senderId: "2",
        senderName: "Jane Smith",
        senderAvatar: "/avatar-2.jpg",
        recipientId: "instructor",
        recipientName: "Instructor",
        subject: "Thank you!",
        content: "Just wanted to say thank you for the great course. I've learned so much!",
        timestamp: "2023-11-14T10:20:00Z",
        isRead: true,
    },
    {
        id: "3",
        senderId: "3",
        senderName: "Bob Johnson",
        senderAvatar: "/avatar-3.jpg",
        recipientId: "instructor",
        recipientName: "Instructor",
        subject: "Suggestion for improvement",
        content: "The course could benefit from more practical examples in advanced sections.",
        timestamp: "2023-11-13T16:45:00Z",
        isRead: true,
    },
]

const mockAnnouncements: Announcement[] = [
    {
        id: "1",
        courseId: "1",
        courseTitle: "React for Beginners",
        title: "New module released",
        content: "I've just added a new module on advanced React hooks. Check it out!",
        timestamp: "2023-11-15T09:00:00Z",
        isScheduled: false,
    },
    {
        id: "2",
        courseId: "2",
        courseTitle: "Advanced TypeScript",
        title: "Office hours this week",
        content: "I'll be hosting office hours this Thursday at 3 PM EST. Come with your questions!",
        timestamp: "2023-11-14T16:30:00Z",
        isScheduled: true,
        scheduledFor: "2023-11-16T15:00:00Z",
    },
]

const mockCourses = [
    { id: "1", title: "React for Beginners" },
    { id: "2", title: "Advanced TypeScript" },
    { id: "3", title: "UI/UX Design Fundamentals" },
]

export const MessagesTab = () => {
    const [activeTab, setActiveTab] = useState("announcements")
    const [search, setSearch] = useState("")
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
    const [replyText, setReplyText] = useState("")
    const [announcementTitle, setAnnouncementTitle] = useState("")
    const [announcementContent, setAnnouncementContent] = useState("")
    const [selectedCourse, setSelectedCourse] = useState("all")
    const [isScheduled, setIsScheduled] = useState(false)
    const [scheduledDate, setScheduledDate] = useState("")

    // Validate form data
    const validateAnnouncementForm = () => {
        return announcementTitle.trim() !== "" && announcementContent.trim() !== ""
    }

    const handleSendMessage = async () => {
        if (!selectedMessage || !replyText.trim()) return

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            setSelectedMessage(null)
            setReplyText("")
            // In a real app, you would call your API here
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }

    const handleCreateAnnouncement = async () => {
        if (!validateAnnouncementForm()) return

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            setAnnouncementTitle("")
            setAnnouncementContent("")
            setIsScheduled(false)
            setScheduledDate("")
            // In a real app, you would call your API here
        } catch (error) {
            console.error("Error creating announcement:", error)
        }
    }

    const filteredMessages = mockMessages.filter(msg =>
        msg.subject.toLowerCase().includes(search.toLowerCase()) ||
        msg.content.toLowerCase().includes(search.toLowerCase()) ||
        msg.senderName.toLowerCase().includes(search.toLowerCase())
    )

    const filteredAnnouncements = mockAnnouncements.filter(announcement =>
        selectedCourse === "all" || announcement.courseId === selectedCourse
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Messages & Announcements</h2>
                <Button className="bg-[#0080ff] hover:bg-[#0066cc]">
                    <Plus className="w-4 h-4 mr-2" />
                    {activeTab === "announcements" ? "Create Announcement" : "Compose Message"}
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 border-b">
                <button
                    onClick={() => setActiveTab("announcements")}
                    className={`pb-2 px-1 border-b-2 border-transparent hover:border-[#0080ff] text-sm font-medium transition-colors ${activeTab === "announcements" ? "text-[#0080ff] border-[#0080ff]" : "text-gray-600"
                        }`}
                >
                    Announcements ({mockAnnouncements.length})
                </button>
                <button
                    onClick={() => setActiveTab("messages")}
                    className={`pb-2 px-1 border-b-2 border-transparent hover:border-[#0080ff] text-sm font-medium transition-colors ${activeTab === "messages" ? "text-[#0080ff] border-[#0080ff]" : "text-gray-600"
                        }`}
                >
                    Messages ({mockMessages.filter(m => !m.isRead).length})
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder={activeTab === "announcements" ? "Search announcements..." : "Search messages..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {activeTab === "announcements" && (
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
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
                )}
            </div>

            {/* Content */}
            {activeTab === "announcements" ? (
                <div className="space-y-4">
                    {/* Create Announcement Form */}
                    <Card className="bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Create New Announcement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    placeholder="Enter announcement title"
                                    value={announcementTitle}
                                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content</label>
                                <Textarea
                                    placeholder="Enter announcement content"
                                    rows={4}
                                    value={announcementContent}
                                    onChange={(e) => setAnnouncementContent(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select course (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Courses</SelectItem>
                                        {mockCourses.map((course) => (
                                            <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="schedule"
                                    checked={isScheduled}
                                    onChange={(e) => setIsScheduled(e.target.checked)}
                                />
                                <label htmlFor="schedule" className="text-sm">Schedule for later</label>
                            </div>
                            {isScheduled && (
                                <Input
                                    type="datetime-local"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                    className="text-sm"
                                />
                            )}
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => {
                                    setAnnouncementTitle("")
                                    setAnnouncementContent("")
                                    setIsScheduled(false)
                                    setScheduledDate("")
                                }}>
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-[#0080ff] hover:bg-[#0066cc]"
                                    onClick={handleCreateAnnouncement}
                                    disabled={!validateAnnouncementForm()}
                                >
                                    Create Announcement
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Announcements List */}
                    <div className="space-y-4">
                        {filteredAnnouncements.length === 0 ? (
                            <Card className="bg-white shadow-sm p-8 text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="flex flex-col items-center space-y-4"
                                >
                                    <MessageSquare className="h-16 w-16 text-gray-400" />
                                    <h3 className="text-lg font-medium text-gray-900">No announcements yet</h3>
                                    <p className="text-gray-600">Create your first announcement to keep students informed.</p>
                                    <Button className="bg-[#0080ff] hover:bg-[#0066cc]">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Announcement
                                    </Button>
                                </motion.div>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredAnnouncements.map((announcement, index) => (
                                    <motion.div
                                        key={announcement.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="bg-white shadow-sm">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {announcement.courseTitle ? `For ${announcement.courseTitle}` : "For all courses"}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        {announcement.isScheduled && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Scheduled for {new Date(announcement.scheduledFor || "").toLocaleDateString()}
                                                            </Badge>
                                                        )}
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(announcement.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">{announcement.content}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Messages List */}
                    {filteredMessages.length === 0 ? (
                        <Card className="bg-white shadow-sm p-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center space-y-4"
                            >
                                <MessageSquare className="h-16 w-16 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900">No messages yet</h3>
                                <p className="text-gray-600">Your inbox is empty. Start a conversation with your students.</p>
                                <Button className="bg-[#0080ff] hover:bg-[#0066cc]">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Compose Message
                                </Button>
                            </motion.div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredMessages.map((message, index) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="bg-white shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                                        <AvatarFallback>{message.senderName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{message.senderName}</h3>
                                                        <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {!message.isRead && (
                                                    <Badge variant="default" className="text-xs bg-blue-500">New</Badge>
                                                )}
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-2">{message.subject}</h4>
                                            <p className="text-gray-700 mb-4">{message.content}</p>
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedMessage(message)}
                                                >
                                                    Reply
                                                </Button>
                                            </div>

                                            {/* Reply Section */}
                                            {selectedMessage?.id === message.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    className="mt-4 p-4 border-t"
                                                >
                                                    <Textarea
                                                        placeholder="Type your reply..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        rows={3}
                                                        className="mb-2"
                                                    />
                                                    <div className="flex justify-end space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedMessage(null)
                                                                setReplyText("")
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSendMessage()}
                                                            disabled={!replyText.trim()}
                                                        >
                                                            <Send className="w-4 h-4 mr-2" />
                                                            Send Reply
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}