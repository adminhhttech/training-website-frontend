"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { InstructorSidebar } from "@/components/instructor/InstructorSidebar.tsx"
import { OverviewTab } from "@/components/instructor/tabs/OverviewTab.tsx"
import { CoursesTab } from "@/components/instructor/tabs/CoursesTab.tsx"
import { CreateCourseTab } from "@/components/instructor/tabs/CreateCourseTab.tsx"
import { StudentsTab } from "@/components/instructor/tabs/StudentsTab.tsx"
import { AnalyticsTab } from "@/components/instructor/tabs/AnalyticsTab.tsx"
import { EarningsTab } from "@/components/instructor/tabs/EarningsTab.tsx"
import { MessagesTab } from "@/components/instructor/tabs/MessagesTab.tsx"
import { ReviewsTab } from "@/components/instructor/tabs/ReviewsTab.tsx"
import { LibraryTab } from "@/components/instructor/tabs/LibraryTab.tsx"
import { SettingsTab } from "@/components/instructor/tabs/SettingsTab.tsx"
import { DeleteCourseDialog } from "@/components/instructor/dialogs/DeleteCourseDialog.tsx"
import { PublishCourseDialog } from "@/components/instructor/dialogs/PublishCourseDialog.tsx"

const InstructorDashboard = () => {
    const navigate = useNavigate()
    const { user, isInitialized, logout } = useAuth()
    const [activeTab, setActiveTab] = useState("overview")
    const [greeting, setGreeting] = useState("")
    const [search, setSearch] = useState("")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeMenuItem, setActiveMenuItem] = useState("overview")
    const [isMobile, setIsMobile] = useState(false)

    // Dialog states
    const [deleteCourseDialogOpen, setDeleteCourseDialogOpen] = useState(false)
    const [publishCourseDialogOpen, setPublishCourseDialogOpen] = useState(false)
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    
    // NEW: Refresh trigger for courses
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting("Good morning")
        else if (hour < 18) setGreeting("Good afternoon")
        else setGreeting("Good evening")
    }, [])

    // Check if mobile and set initial sidebar state
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            if (mobile) {
                setIsSidebarOpen(false)
            } else {
                setIsSidebarOpen(true)
            }
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const userData = user

    useEffect(() => {
        if (isInitialized && !user) {
            navigate("/login")
        }
    }, [user, isInitialized, navigate])

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleCourseClick = (courseId: string) => {
        navigate(`/instructor/courses/${courseId}`)
    }

    // NEW: Function to refresh courses list
    const refreshCourses = () => {
        setRefreshTrigger(prev => prev + 1)
        console.log("Refreshing courses list...")
    }

    // Calculate margin for main content
    const contentStyle = {
        marginLeft: isMobile
            ? (isSidebarOpen ? "200px" : "56px")
            : (isSidebarOpen ? "160px" : "56px"),
        transition: "margin-left 0.25s ease-in-out"
    }

    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#0080ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-[#f7fbff]">
            {/* Fixed navbar at the top */}
            <div className="fixed top-0 left-0 right-0 z-30 h-14 sm:h-16 bg-white shadow-md">
                <Navbar search={search} setSearch={setSearch} />
            </div>

            {/* Main container with sidebar and content */}
            <div className="flex pt-14 sm:pt-16">
                <InstructorSidebar
                    isSidebarOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                    handleLogout={handleLogout}
                    isMobile={isMobile}
                />

                {/* Main Content Area */}
                <div
                    className="flex-1"
                    style={contentStyle}
                >
                    <main className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-10 mb-6 overflow-x-auto bg-gray-100 rounded-lg p-1">
                                <TabsTrigger 
                                    value="overview" 
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="courses"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Courses
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="create"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Create
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="students"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Students
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="analytics"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Analytics
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="earnings"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Earnings
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="messages"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Messages
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="reviews"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Reviews
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="library"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Library
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="settings"
                                    className="data-[state=active]:bg-[#0080ff] data-[state=active]:text-white rounded-md transition-colors"
                                >
                                    Settings
                                </TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview">
                                <OverviewTab
                                    greeting={greeting}
                                    userData={userData}
                                    setActiveTab={setActiveTab}
                                />
                            </TabsContent>

                            {/* My Courses Tab */}
                            <TabsContent value="courses">
                                <CoursesTab
                                    handleCourseClick={handleCourseClick}
                                    setSelectedCourse={setSelectedCourse}
                                    setDeleteCourseDialogOpen={setDeleteCourseDialogOpen}
                                    setPublishCourseDialogOpen={setPublishCourseDialogOpen}
                                    refreshTrigger={refreshTrigger} // NEW: Pass refresh trigger
                                />
                            </TabsContent>

                            {/* Create Course Tab */}
                            <TabsContent value="create">
                                <CreateCourseTab
                                    setActiveTab={setActiveTab}
                                    refreshCourses={refreshCourses} // NEW: Pass refresh function
                                />
                            </TabsContent>

                            {/* Students Tab */}
                            <TabsContent value="students">
                                <StudentsTab />
                            </TabsContent>

                            {/* Analytics Tab */}
                            <TabsContent value="analytics">
                                <AnalyticsTab />
                            </TabsContent>

                            {/* Earnings Tab */}
                            <TabsContent value="earnings">
                                <EarningsTab />
                            </TabsContent>

                            {/* Messages Tab */}
                            <TabsContent value="messages">
                                <MessagesTab />
                            </TabsContent>

                            {/* Reviews Tab */}
                            <TabsContent value="reviews">
                                <ReviewsTab />
                            </TabsContent>

                            {/* Library Tab */}
                            <TabsContent value="library">
                                <LibraryTab />
                            </TabsContent>

                            {/* Settings Tab */}
                            <TabsContent value="settings">
                                <SettingsTab
                                    userData={userData}
                                />
                            </TabsContent>
                        </Tabs>
                    </main>

                    <Footer />
                </div>
            </div>

            {/* Delete Course Dialog - Only render if selectedCourse exists */}
            {selectedCourse && (
                <DeleteCourseDialog
                    open={deleteCourseDialogOpen}
                    setOpen={setDeleteCourseDialogOpen}
                    course={selectedCourse}
                    onSuccess={refreshCourses} // NEW: Refresh after successful deletion
                />
            )}

            {/* Publish/Unpublish Course Dialog - Only render if selectedCourse exists */}
            {selectedCourse && (
                <PublishCourseDialog
                    open={publishCourseDialogOpen}
                    setOpen={setPublishCourseDialogOpen}
                    course={selectedCourse}
                    onSuccess={refreshCourses} // NEW: Refresh after successful publish/unpublish
                />
            )}
        </div>
    )
}

export default InstructorDashboard