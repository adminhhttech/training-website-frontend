// components/instructor/tabs/ReviewsTab.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea" // Added missing import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MessageSquare, Filter, Search, HelpCircle } from "lucide-react" // Added missing icons

interface Review {
    id: string
    studentName: string
    studentAvatar?: string
    courseId: string
    courseTitle: string
    rating: number
    comment: string
    date: string
}

interface Question {
    id: string
    studentName: string
    studentAvatar?: string
    courseId: string
    courseTitle: string
    question: string
    date: string
    isResolved: boolean
    isPinned: boolean
}

const mockReviews: Review[] = [
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
    {
        id: "3",
        studentName: "Bob Johnson",
        studentAvatar: "/avatar-3.jpg",
        courseId: "2",
        courseTitle: "Advanced TypeScript",
        rating: 5,
        comment: "Exactly what I was looking for. Great instructor!",
        date: "2023-11-12T09:45:00Z",
    },
]

const mockQuestions: Question[] = [
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
    {
        id: "3",
        studentName: "Bob Johnson",
        studentAvatar: "/avatar-3.jpg",
        courseId: "2",
        courseTitle: "Advanced TypeScript",
        question: "What's the best way to type API responses?",
        date: "2023-11-13T16:45:00Z",
        isResolved: false,
        isPinned: false,
    },
]

const mockCourses = [
    { id: "1", title: "React for Beginners" },
    { id: "2", title: "Advanced TypeScript" },
    { id: "3", title: "UI/UX Design Fundamentals" },
]

export const ReviewsTab = () => {
    const [activeTab, setActiveTab] = useState("reviews")
    const [search, setSearch] = useState("")
    const [courseFilter, setCourseFilter] = useState("all")
    const [ratingFilter, setRatingFilter] = useState("all")
    const [selectedReview, setSelectedReview] = useState<Review | null>(null)
    const [replyText, setReplyText] = useState("")
    const [isReplying, setIsReplying] = useState(false)

    const filteredReviews = mockReviews.filter(review =>
        courseFilter === "all" || review.courseId === courseFilter
    ).filter(review =>
        ratingFilter === "all" || review.rating === parseInt(ratingFilter)
    ).filter(review =>
        review.studentName.toLowerCase().includes(search.toLowerCase()) ||
        review.comment.toLowerCase().includes(search.toLowerCase()) ||
        review.courseTitle.toLowerCase().includes(search.toLowerCase())
    )

    const filteredQuestions = mockQuestions.filter(question =>
        courseFilter === "all" || question.courseId === courseFilter
    ).filter(question =>
        question.question.toLowerCase().includes(search.toLowerCase()) ||
        question.courseTitle.toLowerCase().includes(search.toLowerCase())
    )

    const handleReplyToReview = async (reviewId: string, reply: string) => {
        if (!reply.trim()) return

        try {
            setIsReplying(true)
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            setSelectedReview(null)
            setReplyText("")
            // In a real app, you would call your API here
        } catch (error) {
            console.error("Error replying to review:", error)
        } finally {
            setIsReplying(false)
        }
    }

    const handleResolveQuestion = async (questionId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            console.log(`Question ${questionId} resolved`)
        } catch (error) {
            console.error("Error resolving question:", error)
        }
    }

    const handlePinQuestion = async (questionId: string) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            // Success
            console.log(`Question ${questionId} pinned`)
        } catch (error) {
            console.error("Error pinning question:", error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Reviews & Q&A</h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 border-b">
                <button
                    onClick={() => setActiveTab("reviews")}
                    className={`pb-2 px-1 border-b-2 border-transparent hover:border-[#0080ff] text-sm font-medium transition-colors ${activeTab === "reviews" ? "text-[#0080ff] border-[#0080ff]" : "text-gray-600"
                        }`}
                >
                    Reviews ({filteredReviews.length})
                </button>
                <button
                    onClick={() => setActiveTab("questions")}
                    className={`pb-2 px-1 border-b-2 border-transparent hover:border-[#0080ff] text-sm font-medium transition-colors ${activeTab === "questions" ? "text-[#0080ff] border-[#0080ff]" : "text-gray-600"
                        }`}
                >
                    Q&A ({filteredQuestions.length})
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder={activeTab === "reviews" ? "Search reviews..." : "Search questions..."}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {activeTab === "reviews" && (
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
                )}
                {activeTab === "reviews" && (
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                        <SelectTrigger className="w-full sm:w-40">
                            <SelectValue placeholder="Filter by rating" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Ratings</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="1">1 Star</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>

            {/* Content */}
            {activeTab === "reviews" ? (
                <div className="space-y-4">
                    {filteredReviews.length === 0 ? (
                        <Card className="bg-white shadow-sm p-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center space-y-4"
                            >
                                <Star className="h-16 w-16 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900">No reviews found</h3>
                                <p className="text-gray-600">Try adjusting your filters.</p>
                            </motion.div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredReviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="bg-white shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={review.studentAvatar} alt={review.studentName} />
                                                        <AvatarFallback>{review.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{review.studentName}</h3>
                                                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-2">{review.courseTitle}</h4>
                                            <p className="text-gray-700 mb-4">{review.comment}</p>
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedReview(review)
                                                        setReplyText("")
                                                    }}
                                                >
                                                    Reply
                                                </Button>
                                            </div>
                                        </CardContent>

                                        {/* Reply Box */}
                                        {selectedReview?.id === review.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="border-t bg-gray-50 p-4"
                                            >
                                                <div className="flex items-start space-x-3 mb-3">
                                                    <Avatar>
                                                        <AvatarImage src={selectedReview.studentAvatar} alt={selectedReview.studentName} />
                                                        <AvatarFallback>{selectedReview.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Replying to {selectedReview.studentName}</p>
                                                    </div>
                                                </div>
                                                <Textarea
                                                    placeholder="Type your reply..."
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    rows={3}
                                                    className="flex-1"
                                                />
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedReview(null)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleReplyToReview(review.id, replyText)}
                                                        disabled={isReplying || !replyText.trim()}
                                                    >
                                                        {isReplying ? "Sending..." : "Send Reply"}
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredQuestions.length === 0 ? (
                        <Card className="bg-white shadow-sm p-8 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="flex flex-col items-center space-y-4"
                            >
                                <HelpCircle className="h-16 w-16 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
                                <p className="text-gray-600">Try adjusting your filters.</p>
                            </motion.div>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredQuestions.map((question, index) => (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Card className="bg-white shadow-sm">
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <Avatar>
                                                        <AvatarImage src={question.studentAvatar} alt={question.studentName} />
                                                        <AvatarFallback>{question.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{question.studentName}</h3>
                                                        <p className="text-sm text-gray-500">{new Date(question.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {question.isPinned && (
                                                        <Badge variant="secondary" className="text-xs">Pinned</Badge>
                                                    )}
                                                    {question.isResolved && (
                                                        <Badge variant="default" className="text-xs bg-green-500">Resolved</Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <h4 className="font-medium text-gray-900 mb-2">{question.courseTitle}</h4>
                                            <p className="text-gray-700 mb-4">{question.question}</p>
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePinQuestion(question.id)}
                                                >
                                                    {question.isPinned ? "Unpin" : "Pin"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleResolveQuestion(question.id)}
                                                >
                                                    {question.isResolved ? "Unresolve" : "Resolve"}
                                                </Button>
                                                <Button variant="default" size="sm">
                                                    Reply
                                                </Button>
                                            </div>
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