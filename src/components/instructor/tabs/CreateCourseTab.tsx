"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

interface CreateCourseTabProps {
    setActiveTab: (tab: string) => void
    refreshCourses?: () => void
}

interface CourseForm {
    title: string
    description: string
    category_id: string
    level: string
    language: string
    thumbnail: string
    price: string
    status: string
    is_free: boolean
}

// Constants
const API_URL = 'https://training-backend-wine.vercel.app/api/course/create_courses'

const COURSE_LEVELS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
] as const

const LANGUAGES = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Chinese", label: "Chinese" }
] as const

const MOCK_CATEGORIES = [
    { id: "1", name: "Web Development" },
    { id: "2", name: "Mobile Development" },
    { id: "3", name: "Data Science" },
    { id: "4", name: "Design" },
    { id: "5", name: "Business" },
    { id: "6", name: "Marketing" }
]

const INITIAL_COURSE_FORM: CourseForm = {
    title: "",
    description: "",
    category_id: "",
    level: "beginner",
    language: "English",
    thumbnail: "",
    price: "0",
    status: "draft",
    is_free: true
}

export const CreateCourseTab = ({ setActiveTab, refreshCourses }: CreateCourseTabProps) => {
    const [activeStep, setActiveStep] = useState("basics")
    const { user, getToken } = useAuth()
    const [courseForm, setCourseForm] = useState<CourseForm>(INITIAL_COURSE_FORM)
    const [isSaving, setIsSaving] = useState(false)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

    // FIXED: Validation with mode support
    const validateForm = useCallback((mode: "draft" | "published" = "published"): { isValid: boolean; errors: Record<string, string> } => {
        const errors: Record<string, string> = {}

        // Always require title (even for drafts)
        if (!courseForm.title.trim()) {
            errors.title = "Course title is required"
        } else if (courseForm.title.trim().length < (mode === "draft" ? 3 : 5)) {
            errors.title = mode === "draft" 
                ? "Title must be at least 3 characters"
                : "Title must be at least 5 characters"
        }

        // Only enforce these when publishing
        if (mode === "published") {
            if (!courseForm.description.trim()) {
                errors.description = "Course description is required"
            } else if (courseForm.description.trim().length < 20) {
                errors.description = "Description must be at least 20 characters"
            }

            if (!courseForm.category_id) {
                errors.category_id = "Category is required"
            }

            const price = parseFloat(courseForm.price)
            if (isNaN(price) || price < 0) {
                errors.price = "Price must be a valid number"
            }
        }

        return { isValid: Object.keys(errors).length === 0, errors }
    }, [courseForm.title, courseForm.description, courseForm.category_id, courseForm.price])

    const handleSaveDraft = async () => {
        const { isValid, errors } = validateForm("draft")
        setValidationErrors(errors)
        
        if (!isValid) {
            toast.error("Please fix the highlighted issues before saving draft")
            return
        }
        await handleCourseSubmit("draft")
    }

    const handlePublish = async () => {
        const { isValid, errors } = validateForm("published")
        setValidationErrors(errors)
        
        if (!isValid) {
            toast.error("Please fix validation errors before publishing")
            return
        }
        await handleCourseSubmit("published")
    }

    // FIXED: Async token handling and better error parsing
    const handleCourseSubmit = async (status: "draft" | "published") => {
        console.log("🔄 Starting course submission...", status)
        
        // Authentication checks
        if (!user?.id) {
            toast.error("Please log in to create a course")
            return
        }

        // FIXED: await getToken() - it's async!
        const token = await getToken()
        console.log("Token fetched:", !!token)
        
        if (!token) {
            toast.error("Authentication token missing. Please log in again.")
            return
        }

        setIsSaving(true)
        
        try {
            // Handle blob URLs
            let thumbnailUrl = courseForm.thumbnail
            if (thumbnailUrl.startsWith('blob:')) {
                thumbnailUrl = ""
            }

            const courseData = {
                title: courseForm.title.trim(),
                description: courseForm.description.trim(),
                instructor_id: user.id,
                category_id: courseForm.category_id,
                level: courseForm.level,
                language: courseForm.language,
                thumbnail: thumbnailUrl,
                price: parseFloat(courseForm.price) || 0,
                is_free: parseFloat(courseForm.price) === 0,
                status: status
            }

            console.log("📤 Sending course data:", courseData)

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(courseData)
            })

            console.log("📥 Response status:", response.status)

            // FIXED: Better error parsing
            const resText = await response.text()
            let result: any = {}
            try { 
                result = JSON.parse(resText) 
            } catch { 
                result = { raw: resText } 
            }

            console.log("📥 Response data:", result)

            if (response.ok && result.course_id) {
                const successMessage = status === "published" 
                    ? "Course published successfully!" 
                    : "Course saved as draft!"
                
                toast.success(successMessage)
                console.log("✅ Success! Course ID:", result.course_id)
                
                // Reset form and navigate
                setCourseForm(INITIAL_COURSE_FORM)
                setValidationErrors({})
                
                // Refresh courses list if callback provided
                if (refreshCourses) {
                    refreshCourses()
                }
                
                setActiveTab("courses")
            } else {
                console.error("❌ Backend error:", result)
                throw new Error(result.message || result.error || result.raw || `Failed to ${status} course`)
            }
        } catch (error) {
            console.error("❌ Error creating course:", error)
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Failed to save course. Please try again."
            toast.error(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    const handlePriceChange = (value: string) => {
        const priceValue = parseFloat(value) || 0
        setCourseForm(prev => ({
            ...prev,
            price: value,
            is_free: priceValue === 0
        }))
        
        // Clear price validation error when user types
        if (validationErrors.price) {
            setValidationErrors(prev => ({ ...prev, price: "" }))
        }
    }

    const handleInputChange = (field: keyof CourseForm, value: string) => {
        setCourseForm(prev => ({ ...prev, [field]: value }))
        
        // Clear validation error when user types
        if (validationErrors[field]) {
            setValidationErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    // Media upload function
    const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if (!validTypes.includes(file.type)) {
                toast.error("Please upload a valid image (JPEG, PNG, GIF, WebP)")
                return
            }

            // Validate file size (10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Image size must be less than 10MB")
                return
            }

            // Create object URL for preview
            const objectUrl = URL.createObjectURL(file)
            setCourseForm(prev => ({ ...prev, thumbnail: objectUrl }))
            
            toast.success("Thumbnail uploaded for preview!")
        }
    }

    const removeThumbnail = () => {
        if (courseForm.thumbnail.startsWith('blob:')) {
            URL.revokeObjectURL(courseForm.thumbnail)
        }
        setCourseForm(prev => ({ ...prev, thumbnail: "" }))
    }

    // File input click handler
    const handleFileInputClick = () => {
        const fileInput = document.getElementById('thumbnail-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.click()
        }
    }

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (courseForm.thumbnail.startsWith('blob:')) {
                URL.revokeObjectURL(courseForm.thumbnail)
            }
        }
    }, [courseForm.thumbnail])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
                    <p className="text-gray-600 mt-1">Build and publish your course to share with students</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("courses")}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    {/* FIXED: Removed !isFormValid from disabled */}
                    <Button
                        className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {isSaving ? "Saving..." : "Save Draft"}
                    </Button>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-4">
                        {["basics", "media", "pricing"].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                    activeStep === step 
                                        ? "bg-[#0080ff] border-[#0080ff] text-white" 
                                        : "border-gray-300 text-gray-500"
                                }`}>
                                    {index + 1}
                                </div>
                                {index < 2 && (
                                    <div className={`w-16 h-0.5 mx-2 ${
                                        activeStep === "media" || activeStep === "pricing" ? "bg-[#0080ff]" : "bg-gray-300"
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        Step {["basics", "media", "pricing"].indexOf(activeStep) + 1} of 3
                    </div>
                </div>
                
                <div className="flex justify-between text-sm font-medium">
                    <span className={activeStep === "basics" ? "text-[#0080ff]" : "text-gray-500"}>
                        Course Basics
                    </span>
                    <span className={activeStep === "media" ? "text-[#0080ff]" : "text-gray-500"}>
                        Media
                    </span>
                    <span className={activeStep === "pricing" ? "text-[#0080ff]" : "text-gray-500"}>
                        Pricing
                    </span>
                </div>
            </div>

            <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                    <TabsTrigger 
                        value="basics" 
                        className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white"
                    >
                        Basics
                    </TabsTrigger>
                    <TabsTrigger 
                        value="media"
                        className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white"
                    >
                        Media
                    </TabsTrigger>
                    <TabsTrigger 
                        value="pricing"
                        className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white"
                    >
                        Pricing
                    </TabsTrigger>
                </TabsList>

                {/* Basics Tab */}
                <TabsContent value="basics" className="space-y-6">
                    <Card className="bg-white shadow-sm border-0">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                                    Course Title *
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Complete Web Development Bootcamp"
                                    value={courseForm.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    className={validationErrors.title ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#0080ff]"}
                                />
                                {validationErrors.title && (
                                    <p className="text-red-500 text-sm">{validationErrors.title}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Make it descriptive and engaging for potential students
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category_id" className="text-sm font-medium text-gray-900">
                                        Category
                                    </Label>
                                    <Select
                                        value={courseForm.category_id}
                                        onValueChange={(value) => handleInputChange('category_id', value)}
                                    >
                                        <SelectTrigger className={validationErrors.category_id ? "border-red-500 focus:ring-red-500" : "focus:ring-[#0080ff]"}>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MOCK_CATEGORIES.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {validationErrors.category_id && (
                                        <p className="text-red-500 text-sm">{validationErrors.category_id}</p>
                                    )}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="level" className="text-sm font-medium text-gray-900">
                                        Skill Level
                                    </Label>
                                    <Select
                                        value={courseForm.level}
                                        onValueChange={(value) => handleInputChange('level', value)}
                                    >
                                        <SelectTrigger className="focus:ring-[#0080ff]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COURSE_LEVELS.map((level) => (
                                                <SelectItem key={level.value} value={level.value}>
                                                    {level.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="language" className="text-sm font-medium text-gray-900">
                                    Language
                                </Label>
                                <Select
                                    value={courseForm.language}
                                    onValueChange={(value) => handleInputChange('language', value)}
                                >
                                    <SelectTrigger className="focus:ring-[#0080ff]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LANGUAGES.map((language) => (
                                            <SelectItem key={language.value} value={language.value}>
                                                {language.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                                    Course Description
                                </Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what students will learn in this course..."
                                    rows={6}
                                    value={courseForm.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className={validationErrors.description ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-[#0080ff]"}
                                />
                                {validationErrors.description && (
                                    <p className="text-red-500 text-sm">{validationErrors.description}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    {courseForm.description.length}/500 characters
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="flex justify-end">
                        <Button 
                            onClick={() => setActiveStep("media")}
                            className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                        >
                            Continue to Media
                        </Button>
                    </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6">
                    <Card className="bg-white shadow-sm border-0">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Course Media</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="thumbnail-upload" className="text-sm font-medium text-gray-900">
                                    Course Thumbnail
                                </Label>
                                
                                {/* Hidden file input */}
                                <Input
                                    id="thumbnail-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    className="hidden"
                                />
                                
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                    {courseForm.thumbnail ? (
                                        <div className="relative inline-block">
                                            <img
                                                src={courseForm.thumbnail}
                                                alt="Course thumbnail preview"
                                                className="h-48 w-64 object-cover rounded-lg shadow-sm mx-auto"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={removeThumbnail}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 mb-1">
                                                    Upload thumbnail
                                                </p>
                                                <p className="text-xs text-gray-500 mb-4">
                                                    PNG, JPG, GIF, WebP up to 10MB
                                                </p>
                                            </div>
                                            <Button 
                                                onClick={handleFileInputClick}
                                                className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                                            >
                                                Select File
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500">
                                    Recommended size: 1280x720 pixels. This will be the first thing students see.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="flex justify-between">
                        <Button 
                            variant="outline" 
                            onClick={() => setActiveStep("basics")}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            Back to Basics
                        </Button>
                        <Button 
                            onClick={() => setActiveStep("pricing")}
                            className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                        >
                            Continue to Pricing
                        </Button>
                    </div>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-6">
                    <Card className="bg-white shadow-sm border-0">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-gray-900">Pricing & Publication</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Label htmlFor="price" className="text-sm font-medium text-gray-900">
                                    Course Price (USD)
                                </Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <Input
                                        id="price"
                                        type="number"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        value={courseForm.price}
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        className="pl-8 focus-visible:ring-[#0080ff]"
                                    />
                                </div>
                                {validationErrors.price && (
                                    <p className="text-red-500 text-sm">{validationErrors.price}</p>
                                )}
                                <div className={`p-3 rounded-lg ${
                                    courseForm.is_free ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                                }`}>
                                    <p className={`text-sm font-medium ${
                                        courseForm.is_free ? 'text-green-800' : 'text-blue-800'
                                    }`}>
                                        {courseForm.is_free 
                                            ? '✓ This course will be available for free' 
                                            : '✓ This course will be available for purchase'
                                        }
                                    </p>
                                </div>
                            </div>
                            
                            <div className="border-t pt-6">
                                <div className="flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleSaveDraft}
                                        disabled={isSaving}
                                        className="min-w-24 border-gray-300 hover:bg-gray-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : null}
                                        {isSaving ? "Saving..." : "Save Draft"}
                                    </Button>
                                    {/* FIXED: Removed !isFormValid from disabled */}
                                    <Button
                                        onClick={handlePublish}
                                        disabled={isSaving}
                                        className="bg-green-600 hover:bg-green-700 min-w-24 text-white"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : null}
                                        {isSaving ? "Publishing..." : "Publish Course"}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="flex justify-start">
                        <Button 
                            variant="outline" 
                            onClick={() => setActiveStep("media")}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            Back to Media
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}