// components/instructor/InstructorSidebar.tsx
"use client"

import { motion } from "framer-motion"
import { Home, BookOpen, Plus, Users, BarChart3, DollarSign, MessageSquare, Star, FolderOpen, Settings, LogOut, Menu, X } from "lucide-react"

interface InstructorSidebarProps {
    isSidebarOpen: boolean
    toggleSidebar: () => void
    activeMenuItem: string
    setActiveMenuItem: (id: string) => void
    handleLogout: () => void
    isMobile?: boolean
}

const menuItems = [
    { id: "overview", label: "Overview", icon: <Home className="w-5 h-5" /> },
    { id: "courses", label: "My Courses", icon: <BookOpen className="w-5 h-5" /> },
    { id: "create", label: "Create Course", icon: <Plus className="w-5 h-5" /> },
    { id: "students", label: "Students & Enrollments", icon: <Users className="w-5 h-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "earnings", label: "Earnings & Payouts", icon: <DollarSign className="w-5 h-5" /> },
    { id: "messages", label: "Messages & Announcements", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "reviews", label: "Reviews & Q&A", icon: <Star className="w-5 h-5" /> },
    { id: "library", label: "Content Library", icon: <FolderOpen className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
]

export const InstructorSidebar = ({
    isSidebarOpen,
    toggleSidebar,
    activeMenuItem,
    setActiveMenuItem,
    handleLogout,
    isMobile = false
}: InstructorSidebarProps) => {
    // Optimized widths - smaller on mobile, moderate on desktop
    const sidebarWidth = isMobile ? (isSidebarOpen ? "200px" : "56px") : (isSidebarOpen ? "160px" : "56px")

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarWidth }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`${isMobile ? 'fixed top-14 inset-y-0' : 'fixed top-16 left-0 h-[calc(100vh-4rem)]'} z-20 bg-[#0080ff] shadow-lg flex flex-col`}
        >
            <div className="flex justify-center items-center py-2 border-b border-white/20">
                <motion.button
                    onClick={toggleSidebar}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                        <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                </motion.button>
            </div>

            <nav className="flex-1 px-1 py-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <motion.button
                        key={item.id}
                        onClick={() => setActiveMenuItem(item.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"} gap-2 px-2 py-2 rounded-lg transition-all text-xs ${activeMenuItem === item.id
                            ? "bg-white/25 text-white ring-1 ring-white/40"
                            : "text-white/80 hover:bg-white/10"
                            }`}
                    >
                        <div className={`${isSidebarOpen ? "w-4 h-4" : "w-5 h-5"} flex-shrink-0 ${activeMenuItem === item.id ? "opacity-100" : "opacity-60"}`}>
                            {item.icon}
                        </div>

                        {/* Label - only when open */}
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-xs font-medium whitespace-nowrap text-white"
                            >
                                {item.label}
                            </motion.span>
                        )}
                    </motion.button>
                ))}
            </nav>

            <div className="p-1 border-t border-white/20">
                <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center ${isSidebarOpen ? "justify-start" : "justify-center"} gap-2 px-2 py-2 rounded-lg transition-all text-xs text-white/80 hover:bg-white/10`}
                >
                    <div className={`${isSidebarOpen ? "w-4 h-4" : "w-5 h-5"} flex-shrink-0`}>
                        <LogOut className="w-full h-full text-white" />
                    </div>

                    {/* Label - only when open */}
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xs font-medium whitespace-nowrap text-white"
                        >
                            Logout
                        </motion.span>
                    )}
                </motion.button>
            </div>
        </motion.aside>
    )
}