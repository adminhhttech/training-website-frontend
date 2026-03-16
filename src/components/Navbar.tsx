"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import { Menu, X, Search, ChevronDown, ChevronRight, User, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Link } from "react-router-dom";

interface NavbarProps {
    search?: string
    setSearch?: (value: string) => void
}

const Navbar = ({ search: propSearch = "", setSearch: propSetSearch }: NavbarProps) => {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [showExploreMenu, setShowExploreMenu] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const [internalSearch, setInternalSearch] = useState(propSearch)
    const exploreRef = useRef<HTMLDivElement | null>(null)
    const profileRef = useRef<HTMLDivElement | null>(null)

    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, user, logout } = useAuth()

    // Get avatar URL based on username
    const getAvatarUrl = () => {
        const fullName = user?.name || 'User';
        // Take only the first name (before first space)
        const firstName = fullName.trim().split(/\s+/)[0].toLowerCase() || 'hht';
        return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(firstName)}`;
    };

    // Handle avatar image error
    const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = "/profile.png";
    };

    const getExploreMenuWidth = () => {
        if (typeof window === "undefined") return "900px"
        if (window.innerWidth < 1280) return "85vw"
        if (window.innerWidth < 1536) return "900px"
        return "1000px"
    }

    // Controlled / uncontrolled search support
    const isControlled = propSetSearch !== undefined
    const searchValue = isControlled ? propSearch : internalSearch

    const handleSearchChange = (value: string) => {
        if (isControlled && propSetSearch) {
            propSetSearch(value)
        } else {
            setInternalSearch(value)
        }
    }

    const onAuth = location.pathname === "/signin" || location.pathname === "/signup"
    const onDashboard = location.pathname === "/dashboard"

    useEffect(() => {
        if (onAuth || onDashboard) {
            setIsScrolled(true)
            return
        }

        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => window.removeEventListener("scroll", handleScroll)
    }, [onAuth, onDashboard])

    // Sync internal state when prop changes (in controlled mode)
    useEffect(() => {
        if (isControlled) {
            setInternalSearch(propSearch)
        }
    }, [propSearch, isControlled])

    // Close explore menu when mobile drawer closes
    useEffect(() => {
        if (!isOpen) setShowExploreMenu(false)
    }, [isOpen])

    // Click outside explore mega menu (desktop)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
                setShowExploreMenu(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Lock body scroll when mobile menu open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    const handleHomeClick = () => {
        navigate("/")
        setIsOpen(false)
    }

    const handleLogout = () => {
        logout()
        navigate("/")
        setIsOpen(false)
        setShowProfileMenu(false)
    }

    const handleProfileClick = () => {
        navigate("/dashboard?tab=profile")
        setIsOpen(false)
        setShowProfileMenu(false)
    }

    const scrolled = onAuth || onDashboard || isScrolled
    const desktopLinkTextColor = "text-[#375A7E]"
    const desktopLinkHoverColor = "hover:text-[#0080ff]"
    const joinForFreeButtonClasses =
        "bg-[#0080ff] text-white hover:bg-[#0080ff]/80"

    const mobileExploreContent = (
        <div className="pl-2 pr-2 text-sm text-[#375A7E] space-y-4 max-h-80 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}>
            <div>
                <h4 className="font-semibold text-[#375A7E] mb-2 text-base">Explore roles</h4>
                <ul className="space-y-2">
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Data Analyst
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Project Manager
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Cyber Security Analyst
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Data Scientist
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        UI / UX Designer
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Machine Learning Engineer
                    </li>
                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium">
                        View all
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-[#375A7E] mb-2 text-base">Explore categories</h4>
                <ul className="space-y-2">
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Business
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Data Science
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Computer Science
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Life Sciences
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Design
                    </li>
                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium">
                        View all
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-[#375A7E] mb-2 text-base">Earn a Certificate</h4>
                <ul className="space-y-2">
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Business
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Computer Science
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Information Technology
                    </li>
                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium">
                        View all
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-[#375A7E] mb-2 text-base">Earn an online degree</h4>
                <ul className="space-y-2">
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Bachelor{"'"}s Degrees
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Master{"'"}s Degrees
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Postgraduate Programs
                    </li>
                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium">
                        View all
                    </li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-[#375A7E] mb-2 text-base">Trending skills</h4>
                <ul className="space-y-2">
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Python
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        AI / ML
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Excel
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        Power BI
                    </li>
                    <li className="py-1 hover:text-[#0080ff] cursor-pointer transition-colors">
                        SQL
                    </li>
                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium">
                        View all
                    </li>
                </ul>
            </div>
        </div>
    )



    return (
        <>
            <motion.nav
                initial={{ y: onAuth || onDashboard ? 0 : -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 rounded-b-xl sm:rounded-b-2xl ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100"
                    : "bg-transparent"
                    }`}
            >
                <div className="w-full px-3 sm:px-4 lg:px-6 max-w-full">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* LEFT: Logo */}
                        <img
                            src={"/navbarIcon.png"}
                            alt="Logo"
                            className="h-8 w-auto transition-all duration-300 cursor-pointer hover:scale-105"
                            onClick={handleHomeClick}
                        />

                        {/* CENTER: Search (desktop / tablet) */}
                        <div className="hidden md:flex flex-1 justify-center px-2 lg:px-4 max-w-2xl mx-4">
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    value={searchValue}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    placeholder="What do you want to learn?"
                                    className="w-full pl-4 pr-12 py-2.5 rounded-full bg-[#F0F4F8] text-[#767676] border border-[#DEE8FC] focus:outline-none transition-all placeholder:text-[#375A7E]/70"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="group absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-colors hover:bg-[#0080ff]/10"
                                >
                                    <Search className="h-4.5 w-4.5 sm:h-4.5 mr-1 sm:w-4.5 text-[#375A7E] transition-colors group-hover:text-[#0080ff]" />
                                </Button>
                            </div>
                        </div>

                        {/* RIGHT: Desktop Explore + Auth */}
                        <div className="hidden md:flex items-center justify-end gap-3 xl:gap-4 flex-shrink-0">

                            {/* AI Counsellor */}

                            <Link
                                to="/counsellor"
                                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors group"
                                title="AI Roadmap Counsellor"
                            >
                                <img
                                    src="/hht-roadmap.png"
                                    alt="AI Roadmap Counsellor"
                                    className="hidden md:block h-8 w-auto transition-transform group-hover:scale-105"
                                />
                            </Link>


                            {/* Explore mega menu */}
                            <div className="relative" ref={exploreRef}>
                                <button
                                    type="button"
                                    onClick={() => setShowExploreMenu((prev) => !prev)}
                                    className="flex items-center justify-center p-2 rounded-md hover:bg-blue-50 transition-colors"
                                    title="Explore"
                                >
                                    <img
                                        src="/explore.png"
                                        alt="Explore"
                                        className="hidden md:block h-10 w-auto transition-transform group-hover:scale-105 md:block md:h-8 md:w-auto md:transition-transform md:group-hover:scale-105"
                                    />
                                </button>


                                {showExploreMenu && (
                                    <div
                                        className="absolute top-full right-0 mt-4 bg-white shadow-2xl border border-gray-200 rounded-xl p-4 md:p-6 z-50 max-h-96 overflow-y-auto"
                                        style={{ width: getExploreMenuWidth() }}
                                    >
                                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 text-sm text-[#375A7E]">
                                            <div>
                                                <h4 className="font-semibold text-[#375A7E] mb-2 md:mb-3 text-sm md:text-base">
                                                    Explore roles
                                                </h4>
                                                <ul className="space-y-1 md:space-y-2">
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Data Analyst
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Project Manager
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Cyber Security Analyst
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Data Scientist
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        UI / UX Designer
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Machine Learning Engineer
                                                    </li>
                                                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium text-xs md:text-sm">
                                                        View all
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-[#375A7E] mb-2 md:mb-3 text-sm md:text-base">
                                                    Explore categories
                                                </h4>
                                                <ul className="space-y-1 md:space-y-2">
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Business
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Data Science
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Computer Science
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Life Sciences
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Design
                                                    </li>
                                                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium text-xs md:text-sm">
                                                        View all
                                                    </li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-[#375A7E] mb-2 md:mb-3 text-sm md:text-base">
                                                    Earn a Certificate
                                                </h4>
                                                <ul className="space-y-1 md:space-y-2">
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Business
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Computer Science
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Information Technology
                                                    </li>
                                                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium text-xs md:text-sm">
                                                        View all
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="hidden md:block">
                                                <h4 className="font-semibold text-[#375A7E] mb-2 md:mb-3 text-sm md:text-base">
                                                    Earn an online degree
                                                </h4>
                                                <ul className="space-y-1 md:space-y-2">
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Bachelor{"'"}s Degrees
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Master{"'"}s Degrees
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Postgraduate Programs
                                                    </li>
                                                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium text-xs md:text-sm">
                                                        View all
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="hidden xl:block">
                                                <h4 className="font-semibold text-[#375A7E] mb-2 md:mb-3 text-sm md:text-base">
                                                    Trending skills
                                                </h4>
                                                <ul className="space-y-1 md:space-y-2">
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Python
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        AI / ML
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Excel
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        Power BI
                                                    </li>
                                                    <li className="hover:text-[#0080ff] cursor-pointer transition-colors py-1 text-xs md:text-sm">
                                                        SQL
                                                    </li>
                                                    <li className="text-[#0080ff] hover:underline cursor-pointer py-1 font-medium text-xs md:text-sm">
                                                        View all
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Auth buttons */}
                            {isAuthenticated ? (
                                <div className="relative flex items-center gap-3" ref={profileRef}>
                                    {/* Profile dropdown */}
                                    <button
                                        onClick={() => setShowProfileMenu((prev) => !prev)}
                                        className="flex items-center gap-2 text-[#375A7E] hover:text-[#0080ff]/90 font-medium transition-colors px-3 py-2 rounded-md hover:bg-[#0080ff]/10 text-sm sm:text-base"
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                                                <img
                                                    src="/boyProfile.png"
                                                    alt="User avatar"
                                                    className="w-full h-full object-cover"
                                                    onError={handleAvatarError}
                                                />
                                            </div>
                                        </div>
                                    </button>

                                    {/* Profile dropdown menu */}
                                    {showProfileMenu && (
                                        <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl border border-gray-200 rounded-xl py-2 z-50 min-w-[200px]">
                                            {/* User info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-[#375A7E] truncate max-w-[180px]">
                                                    {user?.name || "User"}
                                                </p>
                                                <p className="text-xs text-[#375A7E]/70 truncate max-w-[180px]">
                                                    {user?.email || ""}
                                                </p>
                                            </div>

                                            {/* Menu items */}
                                            <div className="py-2">
                                                <button
                                                    onClick={handleProfileClick}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[#375A7E] hover:bg-gray-50 hover:text-[#0080ff] transition-colors text-sm"
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span>Profile</span>
                                                </button>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[#375A7E] hover:bg-gray-50 hover:text-red-600 transition-colors text-sm"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <a href="/signin">
                                        <button
                                            className={`${desktopLinkTextColor} ${desktopLinkHoverColor} font-medium transition-colors text-xs sm:text-sm px-3 py-2 rounded-md hover:bg-gray-50`}
                                        >
                                            Sign In
                                        </button>
                                    </a>
                                    <a href="/signup">
                                        <button
                                            className={`${joinForFreeButtonClasses} px-4 xl:px-6 py-2 sm:py-2.5 rounded-full transition-colors text-xs sm:text-sm font-medium shadow-sm hover:shadow-md`}
                                        >
                                            Join for Free
                                        </button>
                                    </a>
                                </>
                            )}
                        </div>

                        {/* RIGHT: Mobile Hamburger */}
                        <div className="md:hidden flex items-center gap-2">
                            {/* AI Counsellor */}

                            <Link
                                to="/counsellor"
                                className="flex items-center p-2 rounded-md hover:bg-[#0080ff]/10 active:scale-95 transition-all duration-150"
                                title="AI Roadmap Counsellor"
                            >
                                <img
                                    src="/hht-roadmap.png"
                                    alt="AI Roadmap Counsellor"
                                    className="block md:hidden w-6 h-6 object-contain"
                                />
                            </Link>


                            <button
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="p-2 text-[#0080ff] hover:text-[#0080ff]/90 transition-colors rounded-md hover:bg-[#0080ff]/10"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* ---------- MOBILE DROPDOWN DRAWER ---------- */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="md:hidden bg-white shadow-2xl border-t border-gray-100 px-4 py-6 rounded-b-2xl relative z-40 max-h-[80vh] overflow-y-auto"
                            style={{ position: "fixed", left: 0, right: 0, top: "3.5rem" }}
                        >
                            {/* Mobile Search */}
                            <div className="mb-6">
                                <div className="relative w-full">
                                    <Input
                                        type="text"
                                        value={searchValue}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        placeholder="What do you want to learn?"
                                        className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-300 bg-gray-50 text-[#375A7E] placeholder:text-[#375A7E]/70 focus:outline-none focus:ring-2 focus:ring-[#0080ff]/20 focus:border-[#0080ff] focus:bg-white transition-all"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="group absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full hover:bg-[#0080ff]/10"
                                    >
                                        <Search className="h-5 w-5 text-[#375A7E] group-hover:text-[#0080ff] transition-colors" />
                                    </Button>
                                </div>
                            </div>

                            {/* User info (mobile - when authenticated) */}
                            {isAuthenticated && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar with username-based seed */}
                                        <div className="w-12 h-12 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                                            <img
                                                src={getAvatarUrl()}
                                                alt="User avatar"
                                                className="w-full h-full object-cover"
                                                onError={handleAvatarError}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-[#375A7E] text-lg">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-sm text-[#375A7E]/70">
                                                {user?.email || ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Explore collapsible */}
                            <button
                                className="w-full flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowExploreMenu((p) => !p)}
                                type="button"
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/hht-explore.png"
                                        alt="Explore"
                                        className="h-8 w-8 object-contain"
                                    />
                                    <span className="text-lg font-semibold text-[#375A7E]">Explore</span>
                                </div>

                                <motion.div
                                    animate={{ rotate: showExploreMenu ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {showExploreMenu ? (
                                        <ChevronDown className="h-5 w-5 text-[#375A7E]" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-[#375A7E]" />
                                    )}
                                </motion.div>
                            </button>


                            <AnimatePresence>
                                {showExploreMenu && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="py-4">{mobileExploreContent}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Auth links (mobile) */}
                            <div className="space-y-4 pt-4">
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left py-3 px-4 text-[#375A7E] font-medium flex items-center gap-3 rounded-lg hover:bg-gray-50 hover:text-[#0080ff] transition-colors"
                                        >
                                            <User className="w-5 h-5" />
                                            <span className="text-lg">Profile</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full py-3 px-4 bg-gray-100 text-[#375A7E] font-medium rounded-lg text-center hover:bg-gray-200 hover:text-[#0080ff] transition-colors flex items-center justify-center gap-3"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span className="text-lg">Sign Out</span>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <a
                                            href="/signin"
                                            className="block w-full text-left py-3 px-4 text-[#375A7E] font-medium rounded-lg hover:bg-gray-50 hover:text-[#0080ff] transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="text-lg">Sign In</span>
                                        </a>
                                        <a
                                            href="/signup"
                                            className="block w-full py-3 px-4 bg-[#0080ff] text-white font-medium rounded-lg text-center hover:bg-[#0080ff]/90 transition-colors shadow-sm"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="text-lg">Join For Free</span>
                                        </a>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar