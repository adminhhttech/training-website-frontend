import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"


interface SidebarProps {
    activeMenuItem: string
    setActiveMenuItem: (id: string) => void
}

type MenuItem = {
    id: string
    label: string
    activeImg: string
    inactiveImg: string
}

const routeMap: Record<string, string> = {
    home: "/",
    "resume-lab": "/resume-builder",
    mentor: "/mentor"
}

const menuItems: MenuItem[] = [
    {
        id: "home",
        label: "Home",
        activeImg: "/homeActive.png",
        inactiveImg: "/homeInactive.png",
    },
    {
        id: "forum",
        label: "Forum",
        activeImg: "/discussionActive.png",
        inactiveImg: "/discussionInactive.png",
    },
    {
        id: "resume-lab",
        label: "Resume",
        activeImg: "/resumeActive.png",
        inactiveImg: "/resumeInactive.png",
    },
    {
        id: "mock-test",
        label: "Mock Test",
        activeImg: "/mockActive.png",
        inactiveImg: "/mockInactive.png",
    },
    // ========== NEW MENTOR ITEM ==========
    {
        id: "mentor",
        label: "Mentor",
        activeImg: "/mentorActive.png",
        inactiveImg: "/mentorInactive.png",
    },
]

export const Sidebar = ({
    activeMenuItem,
    setActiveMenuItem,
}: SidebarProps) => {
    /* ================= MOBILE DOCK STATE ================= */
    const navigate = useNavigate()
    const [showDock, setShowDock] = useState(true)
    const lastScrollY = useRef(0)
    const touchStartY = useRef<number | null>(null)

    /* ================= SCROLL HIDE / SHOW ================= */
    useEffect(() => {
        const onScroll = () => {
            if (window.innerWidth >= 768) return

            const currentY = window.scrollY

            if (currentY > lastScrollY.current + 12) {
                setShowDock(false)
            } else if (currentY < lastScrollY.current - 12) {
                setShowDock(true)
            }

            lastScrollY.current = currentY
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    const handleNavigation = (id: string) => {
    setActiveMenuItem(id)

    const route = routeMap[id]

    if (route) {
        navigate(route)
    }
}

const location = useLocation()

useEffect(() => {
    const current = Object.entries(routeMap).find(
        ([, path]) => location.pathname === path
    )

    if (current) {
        setActiveMenuItem(current[0])
    }
}, [location.pathname])

    /* ================= GESTURE SWIPE SUPPORT ================= */
    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY
        }

        const onTouchMove = (e: TouchEvent) => {
            if (touchStartY.current === null) return

            const diff = touchStartY.current - e.touches[0].clientY

            if (diff > 40) {
                setShowDock(true)
                touchStartY.current = null
            }

            if (diff < -40) {
                setShowDock(false)
                touchStartY.current = null
            }
        }

        window.addEventListener("touchstart", onTouchStart, { passive: true })
        window.addEventListener("touchmove", onTouchMove, { passive: true })

        return () => {
            window.removeEventListener("touchstart", onTouchStart)
            window.removeEventListener("touchmove", onTouchMove)
        }
    }, [])

    return (
        <>
            {/* ================= DESKTOP SIDEBAR ================= */}
            <aside className="hidden md:block fixed top-20 left-0 h-[calc(87vh)] z-40">
                <div className="ml-3 w-[76px] h-full bg-[#eef6ff] rounded-2xl flex flex-col items-center py-4">
                    <div className="flex-1 flex flex-col gap-4 group">
                        {menuItems.map((item) => {
                            const isActive = activeMenuItem === item.id

                            return (
                                <div key={item.id} className="relative flex justify-center group/item">
                                    <button
onClick={() => handleNavigation(item.id)}                                        className={`
                                            w-12 h-12 rounded-2xl flex items-center justify-center
                                            bg-white/80 transition-all duration-300 ease-out
                                            group-hover:scale-[0.92] hover:!scale-[1.15]
                                            ${
                                                isActive
                                                    ? "scale-110 bg-white shadow-md"
                                                    : "hover:bg-white"
                                            }
                                        `}
                                    >
                                        <img
                                            src={isActive ? item.activeImg : item.inactiveImg}
                                            alt={item.label}
                                            className={`w-6 h-6 object-contain transition-all duration-300 ${
                                                isActive ? "scale-110 opacity-100" : "opacity-80"
                                            }`}
                                        />
                                    </button>

                                    {/* Tooltip */}
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium px-3 py-2 rounded-md opacity-0 group-hover/item:opacity-100 transition-all duration-200 ml-3 shadow-xl">
                                        {item.label}
                                        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* ================= MOBILE BOTTOM DOCK ================= */}
            <nav
                className={`
                    md:hidden fixed bottom-0 left-0 right-0 z-50
                    transition-transform duration-300 ease-out
                    ${showDock ? "translate-y-0" : "translate-y-full"}
                `}
            >
                <div className="mx-4 mb-3 h-[64px] bg-white/95 backdrop-blur rounded-2xl border shadow-[0_-6px_20px_rgba(0,0,0,0.08)] flex items-center justify-between px-2">
                    {menuItems.map((item) => {
                        const isActive = activeMenuItem === item.id

                        return (
                            <button
                                key={item.id}
onClick={() => handleNavigation(item.id)}                                className="flex flex-col items-center justify-center flex-1 h-full relative"
                            >
                                {isActive && (
                                    <span className="absolute -top-1 h-1.5 w-1.5 rounded-full bg-[#00a7ff]" />
                                )}

                                <div
                                    className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                                        isActive ? "scale-110" : ""
                                    }`}
                                >
                                    <img
                                        src={isActive ? item.activeImg : item.inactiveImg}
                                        alt={item.label}
                                        className={`w-6 h-6 object-contain transition-all duration-300 ${
                                            isActive ? "opacity-100" : "opacity-80"
                                        }`}
                                    />
                                </div>

                                <span
                                    className={`text-[11px] mt-0.5 ${
                                        isActive
                                            ? "text-blue-600 font-medium"
                                            : "text-[#375A7E]"
                                    }`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}