"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface PublishCourseDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    course: {
        id: string
        title: string
        status: "draft" | "in_review" | "published" | "unlisted" | "archived"
        description?: string
        thumbnailUrl?: string
    } | null // Allow course to be null
    onSuccess?: () => void // NEW: Add this prop
}

export const PublishCourseDialog = ({ open, setOpen, course, onSuccess }: PublishCourseDialogProps) => {
    const [isPublishing, setIsPublishing] = useState(false)

    // If no course is selected, don't render the dialog content
    if (!course) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Error</DialogTitle>
                        <DialogDescription>
                            No course selected. Please try again.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    const handlePublish = async () => {
        setIsPublishing(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // NEW: Show success message
            toast.success("Course published successfully!")
            setOpen(false)
            
            // NEW: Call onSuccess callback to refresh courses list
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error("Error publishing course:", error)
            toast.error("Failed to publish course")
        } finally {
            setIsPublishing(false)
        }
    }

    const handleUnpublish = async () => {
        setIsPublishing(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            // NEW: Show success message
            toast.success("Course unpublished successfully!")
            setOpen(false)
            
            // NEW: Call onSuccess callback to refresh courses list
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error("Error unpublishing course:", error)
            toast.error("Failed to unpublish course")
        } finally {
            setIsPublishing(false)
        }
    }

    const isReadyToPublish = () => {
        // Check if course has required fields
        return course.title && course.description && course.thumbnailUrl
    }

    const getActionButton = () => {
        if (course.status === "published") {
            return (
                <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleUnpublish}
                    disabled={isPublishing}
                >
                    {isPublishing ? "Unpublishing..." : "Unpublish"}
                </Button>
            )
        } else {
            return (
                <Button
                    className="bg-[#0080ff] hover:bg-[#0066cc] text-white"
                    onClick={handlePublish}
                    disabled={isPublishing || !isReadyToPublish()}
                >
                    {isPublishing ? "Publishing..." : "Publish"}
                </Button>
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {course.status === "published" ? "Unpublish Course" : "Publish Course"}
                    </DialogTitle>
                    <DialogDescription>
                        {course.status === "published"
                            ? `Are you sure you want to unpublish "${course.title}"? Students will no longer be able to enroll.`
                            : `Are you ready to publish "${course.title}"? Make sure you have completed all necessary information.`
                        }
                    </DialogDescription>
                </DialogHeader>
                
                {course.status !== "published" && !isReadyToPublish() && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <p className="text-sm text-yellow-800">
                            Please complete all required fields (title, description, and thumbnail) before publishing.
                        </p>
                    </div>
                )}
                
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPublishing}>
                        Cancel
                    </Button>
                    {getActionButton()}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}