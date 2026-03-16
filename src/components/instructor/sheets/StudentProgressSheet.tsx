// components/instructor/sheets/StudentProgressSheet.tsx
"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Send, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

interface StudentProgressSheetProps {
    enrollment: {
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
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const StudentProgressSheet = ({ enrollment, open, onOpenChange }: StudentProgressSheetProps) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Student Progress</SheetTitle>
                    <SheetDescription>
                        Detailed progress information for {enrollment.studentName}
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Student Info */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={enrollment.studentAvatar} alt={enrollment.studentName} />
                            <AvatarFallback>{enrollment.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium text-lg">{enrollment.studentName}</h3>
                            <p className="text-sm text-gray-500">{enrollment.studentEmail}</p>
                        </div>
                    </div>

                    {/* Course Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Course Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Course</span>
                                <span className="text-sm">{enrollment.courseTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Enrolled On</span>
                                <span className="text-sm">{new Date(enrollment.enrolledOn).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium">Last Activity</span>
                                <span className="text-sm">{new Date(enrollment.lastActivity).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Progress Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Completion</span>
                                <span className="text-sm font-medium">{enrollment.progress}%</span>
                            </div>
                            <Progress value={enrollment.progress} className="w-full" />
                            <p className="text-sm text-gray-500">
                                {enrollment.progress === 100
                                    ? "Course completed"
                                    : `${enrollment.progress}% complete`
                                }
                            </p>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex flex-col space-y-3">
                        <Button variant="outline" className="w-full">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Progress Reminder
                        </Button>
                        <Button className="w-full bg-[#0080ff] hover:bg-[#0066cc]">
                            <Send className="w-4 h-4 mr-2" />
                            Message Student
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}