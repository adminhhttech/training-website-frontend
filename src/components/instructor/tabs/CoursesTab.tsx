"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Eye, Edit, Copy, Trash2, MoreVertical, PlayCircle, BookOpen, Search, Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

interface Course {
    id: string
    _id?: string
    title: string
    description: string
    instructor_id: string
    category_id: string
    level: string
    language: string
    thumbnail: string
    price: number
    is_free: boolean
    status: "draft" | "published" | "archived"
    created_at: string
    updated_at: string
    enrollments?: number
    rating?: number
    revenue?: number
}

interface CoursesTabProps {
    handleCourseClick: (courseId: string) => void
    setSelectedCourse: (course: Course | null) => void
    setDeleteCourseDialogOpen: (open: boolean) => void
    setPublishCourseDialogOpen: (open: boolean) => void
    refreshTrigger?: number
}

export const CoursesTab = ({
    handleCourseClick,
    setSelectedCourse,
    setDeleteCourseDialogOpen,
    setPublishCourseDialogOpen,
    refreshTrigger
}: CoursesTabProps) => {
    const [search, setSearch] = useState("")
    const [courseStatusFilter, setCourseStatusFilter] = useState<string>("all")
    const [courseSortBy, setCourseSortBy] = useState<string>("updated_at")
    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { user, getToken } = useAuth()

    const fetchCourses = async () => {
        if (!user?.id) return
        
        setIsLoading(true)
        try {
            const token = getToken()
            const response = await fetch(`https://training-backend-wine.vercel.app/api/course/get_courses`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                
                // The API returns an array of courses directly
                const coursesData = Array.isArray(data) ? data : data.courses || data

                // Filter courses by current instructor
                const instructorCourses = coursesData?.filter((course: any) => {
                    const instructorId = course.instructor_id
                    return instructorId === user.id
                }) || []
                
                // Map to our Course interface format
                const formattedCourses: Course[] = instructorCourses.map((course: any) => ({
                    id: course._id || course.id,
                    _id: course._id,
                    title: course.title,
                    description: course.description,
                    instructor_id: course.instructor_id,
                    category_id: course.category_id,
                    level: course.level,
                    language: course.language,
                    thumbnail: course.thumbnail,
                    price: course.price,
                    is_free: course.is_free,
                    status: course.status,
                    created_at: course.created_at,
                    updated_at: course.updated_at,
                    enrollments: course.enrollments,
                    rating: course.rating,
                    revenue: course.revenue
                }))
                
                setCourses(formattedCourses)
            } else {
                toast.error("Failed to fetch courses")
                setCourses([])
            }
        } catch (error) {
            console.error("Error fetching courses:", error)
            toast.error("Failed to load courses")
            setCourses([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [user?.id, refreshTrigger])

    const filteredCourses = courses
        .filter(course => {
            const matchesSearch = search === "" ||
                course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.description?.toLowerCase().includes(search.toLowerCase())

            const matchesStatus = courseStatusFilter === "all" || course.status === courseStatusFilter

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            if (courseSortBy === "updated_at") {
                return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            } else if (courseSortBy === "created_at") {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            } else if (courseSortBy === "price") {
                return (b.price || 0) - (a.price || 0)
            }
            return 0
        })

    const handleDeleteCourse = (courseId: string) => {
        const course = courses.find(c => c.id === courseId)
        if (course) {
            setSelectedCourse(course)
            setDeleteCourseDialogOpen(true)
        }
    }

    const handlePublishCourse = async (courseId: string) => {
        const course = courses.find(c => c.id === courseId)
        if (!course) return

        try {
            const token = getToken()
            const response = await fetch(`https://training-backend-wine.vercel.app/api/course/${courseId}/publish`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                toast.success("Course published successfully!")
                fetchCourses()
            } else {
                const error = await response.json()
                toast.error(error.message || "Failed to publish course")
            }
        } catch (error) {
            toast.error("Failed to publish course")
        }
    }

    const handleUnpublishCourse = async (courseId: string) => {
        try {
            const token = getToken()
            const response = await fetch(`https://training-backend-wine.vercel.app/api/course/${courseId}/unpublish`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                toast.success("Course unpublished successfully!")
                fetchCourses()
            } else {
                const error = await response.json()
                toast.error(error.message || "Failed to unpublish course")
            }
        } catch (error) {
            toast.error("Failed to unpublish course")
        }
    }

    const handleDuplicateCourse = async (courseId: string) => {
        try {
            const token = getToken()
            const response = await fetch(`https://training-backend-wine.vercel.app/api/course/${courseId}/duplicate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                toast.success("Course duplicated successfully!")
                fetchCourses()
            } else {
                const error = await response.json()
                toast.error(error.message || "Failed to duplicate course")
            }
        } catch (error) {
            toast.error("Failed to duplicate course")
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-800 border-green-200"
            case "draft":
                return "bg-gray-100 text-gray-800 border-gray-200"
            case "archived":
                return "bg-red-100 text-red-800 border-red-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    const getStatusText = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1)
    }

    const formatPrice = (price: number) => {
        return price === 0 ? "Free" : `$${price.toFixed(2)}`
    }

    const getCategoryName = (categoryId: string) => {
        const categories = {
            "1": "Web Development",
            "2": "Mobile Development", 
            "3": "Data Science",
            "4": "Design",
            "5": "Business",
            "6": "Marketing"
        }
        return categories[categoryId as keyof typeof categories] || "Unknown"
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <div className="aspect-video bg-gray-200" />
                            <CardContent className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="flex gap-2">
                                    <div className="h-6 bg-gray-200 rounded w-16" />
                                    <div className="h-6 bg-gray-200 rounded w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                        <Input
                            placeholder="Search courses..."
                            className="pl-10 w-full sm:w-64 focus-visible:ring-[#0080ff]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    <Select value={courseStatusFilter} onValueChange={setCourseStatusFilter}>
                        <SelectTrigger className="w-full sm:w-40 focus:ring-[#0080ff]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={courseSortBy} onValueChange={setCourseSortBy}>
                        <SelectTrigger className="w-full sm:w-40 focus:ring-[#0080ff]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="updated_at">Last Updated</SelectItem>
                            <SelectItem value="created_at">Date Created</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 ? (
                <Card className="bg-white shadow-sm p-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center space-y-4"
                    >
                        <BookOpen className="h-16 w-16 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900">
                            {courses.length === 0 ? "No courses yet" : "No courses found"}
                        </h3>
                        <p className="text-gray-600">
                            {courses.length === 0 
                                ? "Get started by creating your first course." 
                                : "Try adjusting your search or filters."
                            }
                        </p>
                        <Button className="bg-[#0080ff] hover:bg-[#0066cc] text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Course
                        </Button>
                    </motion.div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course, index) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col border-0">
                                <div className="aspect-video bg-gray-200 relative">
                                    <img
                                        src={course.thumbnail || "/placeholder-course.jpg"}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <Badge
                                        className={`absolute top-2 right-2 ${getStatusColor(course.status)}`}
                                    >
                                        {getStatusText(course.status)}
                                    </Badge>
                                </div>
                                <CardContent className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                            {getCategoryName(course.category_id)}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            {course.level}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            {formatPrice(course.price)}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Updated {new Date(course.updated_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCourseClick(course.id)}
                                            className="border-gray-300 hover:bg-gray-50"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => console.log("Edit course", course.id)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicateCourse(course.id)}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                {course.status === "published" ? (
                                                    <DropdownMenuItem onClick={() => handleUnpublishCourse(course.id)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Unpublish
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem onClick={() => handlePublishCourse(course.id)}>
                                                        <PlayCircle className="w-4 h-4 mr-2" />
                                                        Publish
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteCourse(course.id)}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}