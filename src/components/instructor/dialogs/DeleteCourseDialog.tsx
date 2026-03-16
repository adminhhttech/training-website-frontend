"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DeleteCourseDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    course: {
        id: string
        title: string
    } | null // Allow course to be null
    onSuccess?: () => void // ADD THIS LINE
}

export const DeleteCourseDialog = ({ open, setOpen, course, onSuccess }: DeleteCourseDialogProps) => {
    const [isDeleting, setIsDeleting] = useState(false)

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

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            setOpen(false)
            
            // ADD THIS: Call onSuccess callback after successful deletion
            if (onSuccess) {
                onSuccess()
            }
        } catch (error) {
            console.error("Error deleting course:", error)
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Course</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{course.title}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete Course"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}