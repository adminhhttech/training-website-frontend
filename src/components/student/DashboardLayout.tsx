import { ReactNode } from "react"
import { Sidebar } from "./Sidebar"

interface DashboardLayoutProps {
    children: ReactNode
    activeMenuItem: string
    setActiveMenuItem: (id: string) => void
    handleLogout: () => void
}
export const DashboardLayout = ({
    children,
    activeMenuItem,
    setActiveMenuItem,
    
}: DashboardLayoutProps) => {
    return (
        <div className="bg-white">
            <Sidebar
                activeMenuItem={activeMenuItem}
                setActiveMenuItem={setActiveMenuItem}

            />

            <main
                className="
                    pt-14 md:pt-10
                    md:pl-[88px]
                    w-full
                "
            >
                <div className="
                    px-4 sm:px-4 lg:px-4
                    pt-4 sm:pt-4 lg:pt-4
                ">
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
