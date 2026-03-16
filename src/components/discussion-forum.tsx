"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, ThumbsUp, Send, Search, Plus, Clock, ChevronDown, ChevronUp } from "lucide-react"

// Mock discussion data
const mockDiscussions = [
    {
        id: 1,
        title: "Best resources for learning React hooks?",
        author: "Sarah Johnson",
        avatar: "/female-student-avatar.png",
        content:
            "I'm struggling with useEffect and useCallback. Can anyone recommend some good tutorials or explain when to use each?",
        category: "React",
        likes: 24,
        replies: [
            {
                id: 1,
                author: "Mike Chen",
                avatar: "/male-student-avatar.png",
                content:
                    "I found the official React docs really helpful! Also check out Kent C. Dodds' blog for in-depth explanations.",
                timestamp: "2 hours ago",
                likes: 8,
            },
            {
                id: 2,
                author: "Emily Davis",
                avatar: "/female-avatar-brunette.jpg",
                content:
                    "useCallback is mainly for preventing unnecessary re-renders when passing callbacks to child components. useEffect is for side effects like API calls.",
                timestamp: "1 hour ago",
                likes: 12,
            },
        ],
        timestamp: "5 hours ago",
        isLiked: false,
    },
    {
        id: 2,
        title: "Study group for JavaScript fundamentals",
        author: "Alex Thompson",
        avatar: "/male-student-glasses.jpg",
        content: "Looking to form a study group to practice JS concepts together. Anyone interested in weekly sessions?",
        category: "JavaScript",
        likes: 18,
        replies: [
            {
                id: 1,
                author: "Lisa Park",
                avatar: "/asian-female-avatar.png",
                content: "Count me in! I'm available on weekends.",
                timestamp: "3 hours ago",
                likes: 5,
            },
        ],
        timestamp: "1 day ago",
        isLiked: true,
    },
    {
        id: 3,
        title: "Tips for staying motivated during long courses?",
        author: "David Wilson",
        avatar: "/male-professional-avatar.jpg",
        content:
            "I often lose motivation halfway through longer courses. How do you all stay consistent with your learning?",
        category: "General",
        likes: 42,
        replies: [],
        timestamp: "2 days ago",
        isLiked: false,
    },
]

const categories = ["All", "React", "JavaScript", "Python", "General", "Career"]

export function DiscussionForum() {
    const [discussions, setDiscussions] = useState(mockDiscussions)
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [expandedPost, setExpandedPost] = useState<number | null>(null)
    const [showNewPost, setShowNewPost] = useState(false)
    const [newPost, setNewPost] = useState({ title: "", content: "", category: "General" })
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({})

    const filteredDiscussions = discussions.filter((d) => {
        const matchesCategory = selectedCategory === "All" || d.category === selectedCategory
        const matchesSearch =
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.content.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const handleLike = (postId: number) => {
        setDiscussions((prev) =>
            prev.map((d) => {
                if (d.id === postId) {
                    return {
                        ...d,
                        likes: d.isLiked ? d.likes - 1 : d.likes + 1,
                        isLiked: !d.isLiked,
                    }
                }
                return d
            }),
        )
    }

    const handleReplyLike = (postId: number, replyId: number) => {
        setDiscussions((prev) =>
            prev.map((d) => {
                if (d.id === postId) {
                    return {
                        ...d,
                        replies: d.replies.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)),
                    }
                }
                return d
            }),
        )
    }

    const handleCreatePost = () => {
        if (!newPost.title.trim() || !newPost.content.trim()) return

        const post = {
            id: discussions.length + 1,
            title: newPost.title,
            author: "You",
            avatar: "/current-user-avatar.png",
            content: newPost.content,
            category: newPost.category,
            likes: 0,
            replies: [],
            timestamp: "Just now",
            isLiked: false,
        }

        setDiscussions([post, ...discussions])
        setNewPost({ title: "", content: "", category: "General" })
        setShowNewPost(false)
    }

    const handleAddReply = (postId: number) => {
        const text = replyText[postId]
        if (!text?.trim()) return

        setDiscussions((prev) =>
            prev.map((d) => {
                if (d.id === postId) {
                    return {
                        ...d,
                        replies: [
                            ...d.replies,
                            {
                                id: d.replies.length + 1,
                                author: "You",
                                avatar: "/current-user-avatar.png",
                                content: text,
                                timestamp: "Just now",
                                likes: 0,
                            },
                        ],
                    }
                }
                return d
            }),
        )
        setReplyText((prev) => ({ ...prev, [postId]: "" }))
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0B254B]">Discussion Forum</h2>
                    <p className="text-sm text-gray-500 mt-1">Connect with fellow students and share knowledge</p>
                </div>
                <Button onClick={() => setShowNewPost(true)} className="bg-[#0080ff] hover:bg-[#0066cc] text-white gap-2">
                    <Plus className="w-4 h-4" />
                    New Discussion
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search discussions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {categories.map((cat) => (
                        <Badge
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            className={`cursor-pointer transition-all ${selectedCategory === cat
                                    ? "bg-[#0080ff] hover:bg-[#0066cc] text-white"
                                    : "hover:bg-gray-100 text-gray-600"
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* New Post Form */}
            <AnimatePresence>
                {showNewPost && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <Card className="rounded-xl shadow-md border-[#0080ff]/20">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">Start a New Discussion</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Input
                                    placeholder="Discussion title..."
                                    value={newPost.title}
                                    onChange={(e) => setNewPost((prev) => ({ ...prev, title: e.target.value }))}
                                />
                                <Textarea
                                    placeholder="Share your thoughts, questions, or ideas..."
                                    value={newPost.content}
                                    onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                                    rows={4}
                                />
                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                                    <select
                                        value={newPost.category}
                                        onChange={(e) => setNewPost((prev) => ({ ...prev, category: e.target.value }))}
                                        className="px-3 py-2 border rounded-md text-sm bg-white"
                                    >
                                        {categories
                                            .filter((c) => c !== "All")
                                            .map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => setShowNewPost(false)}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleCreatePost} className="bg-[#0080ff] hover:bg-[#0066cc] text-white">
                                            Post Discussion
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Discussions List */}
            <div className="space-y-4">
                {filteredDiscussions.length === 0 ? (
                    <Card className="rounded-xl shadow-md">
                        <CardContent className="p-8 text-center">
                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No discussions found. Be the first to start one!</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredDiscussions.map((discussion) => (
                        <motion.div key={discussion.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 sm:p-6">
                                    {/* Post Header */}
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                            <AvatarImage src={discussion.avatar || "/placeholder.svg"} alt={discussion.author} />
                                            <AvatarFallback>{discussion.author[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold text-[#0B254B] text-base sm:text-lg">{discussion.title}</h3>
                                                <Badge variant="secondary" className="text-xs bg-[#e8f2ff] text-[#0080ff]">
                                                    {discussion.category}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                                                <span className="font-medium">{discussion.author}</span>
                                                <span>•</span>
                                                <Clock className="w-3 h-3" />
                                                <span>{discussion.timestamp}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed">{discussion.content}</p>

                                    {/* Post Actions */}
                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                        <button
                                            onClick={() => handleLike(discussion.id)}
                                            className={`flex items-center gap-1.5 text-sm transition-colors ${discussion.isLiked ? "text-[#0080ff]" : "text-gray-500 hover:text-[#0080ff]"
                                                }`}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${discussion.isLiked ? "fill-current" : ""}`} />
                                            <span>{discussion.likes}</span>
                                        </button>
                                        <button
                                            onClick={() => setExpandedPost(expandedPost === discussion.id ? null : discussion.id)}
                                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#0080ff] transition-colors"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{discussion.replies.length} replies</span>
                                            {expandedPost === discussion.id ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Replies Section */}
                                    <AnimatePresence>
                                        {expandedPost === discussion.id && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 space-y-3"
                                            >
                                                {/* Existing Replies */}
                                                {discussion.replies.map((reply) => (
                                                    <div key={reply.id} className="flex gap-3 pl-4 sm:pl-8 border-l-2 border-gray-100">
                                                        <Avatar className="w-8 h-8 flex-shrink-0">
                                                            <AvatarImage src={reply.avatar || "/placeholder.svg"} alt={reply.author} />
                                                            <AvatarFallback>{reply.author[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                                <span className="font-medium text-[#0B254B]">{reply.author}</span>
                                                                <span className="text-gray-400">•</span>
                                                                <span className="text-gray-400">{reply.timestamp}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-700 mt-1">{reply.content}</p>
                                                            <button
                                                                onClick={() => handleReplyLike(discussion.id, reply.id)}
                                                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0080ff] mt-2 transition-colors"
                                                            >
                                                                <ThumbsUp className="w-3 h-3" />
                                                                <span>{reply.likes}</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Reply Input */}
                                                <div className="flex gap-3 pl-4 sm:pl-8 pt-3">
                                                    <Avatar className="w-8 h-8 flex-shrink-0">
                                                        <AvatarFallback>Y</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 flex gap-2">
                                                        <Input
                                                            placeholder="Write a reply..."
                                                            value={replyText[discussion.id] || ""}
                                                            onChange={(e) =>
                                                                setReplyText((prev) => ({
                                                                    ...prev,
                                                                    [discussion.id]: e.target.value,
                                                                }))
                                                            }
                                                            className="flex-1"
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter" && !e.shiftKey) {
                                                                    e.preventDefault()
                                                                    handleAddReply(discussion.id)
                                                                }
                                                            }}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            onClick={() => handleAddReply(discussion.id)}
                                                            className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}
